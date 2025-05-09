import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface ServerSettingsViewModel {
  enabled: boolean;
  language: string;
  systemPrompt: string | null;
  channels: string[];
  supportRoleId: string | null;
  maxMessagesPerUser: number;
  maxTextLength: number;
}

interface ChannelOption {
  id: string;
  name: string;
}

interface RoleOption {
  id: string;
  name: string;
}

// Dodajemy interfejs dla błędów walidacji zewnętrznej (np. z API)
export interface FieldError {
  field: keyof ServerSettingsViewModel;
  message: string;
}

interface ServerSettingsFormProps {
  initialData: ServerSettingsViewModel;
  onSubmit: (
    data: ServerSettingsViewModel,
    setFieldError: (field: keyof ServerSettingsViewModel, message: string) => void
  ) => Promise<void>;
  isLoading: boolean;
  availableChannels: ChannelOption[];
  availableRoles: RoleOption[];
  // Dodajemy możliwość przekazania początkowych błędów walidacji
  initialErrors?: FieldError[];
  // Add disabled prop
  disabled?: boolean;
}

// Form validation schema using zod
const formSchema = z.object({
  enabled: z.boolean(),
  language: z.string().min(1, { message: "Language is required" }),
  systemPrompt: z.string().nullable().optional(),
  channels: z.array(z.string().regex(/^\d+$/, { message: "Channel ID must contain only digits" })).default([]),
  supportRoleId: z.string().nullable().optional(),
  maxMessagesPerUser: z
    .number()
    .int()
    .min(1, { message: "Must be at least 1" })
    .max(100, { message: "Cannot exceed 100" }),
  maxTextLength: z
    .number()
    .int()
    .min(100, { message: "Must be at least 100" })
    .max(4000, { message: "Cannot exceed 4000" }),
});

export const ServerSettingsForm = ({
  initialData,
  onSubmit,
  isLoading,
  availableChannels,
  availableRoles,
  initialErrors = [],
  disabled = false,
}: ServerSettingsFormProps) => {
  // Initialize the form with react-hook-form and zod - Use ViewModel directly
  const form = useForm<ServerSettingsViewModel>({
    // @ts-expect-error - Type mismatch between Zod resolver and ServerSettingsViewModel
    resolver: zodResolver(formSchema),
    // Ensure defaultValues provided match the ViewModel structure precisely
    defaultValues: {
      ...initialData,
      systemPrompt: initialData.systemPrompt ?? null,
      supportRoleId: initialData.supportRoleId ?? null,
      channels: initialData.channels ?? [],
    },
  });

  // Utwórz helper do ustawiania błędów pól
  const setFieldError = (field: keyof ServerSettingsViewModel, message: string) => {
    form.setError(field, { message });
  };

  // Zastosuj początkowe błędy, jeśli są dostępne
  React.useEffect(() => {
    if (initialErrors.length > 0) {
      initialErrors.forEach((error) => {
        setFieldError(error.field, error.message);
      });
    }
  }, [initialErrors]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission using the ViewModel type
  const handleSubmit = async (data: ServerSettingsViewModel) => {
    await onSubmit(data, setFieldError);
  };

  return (
    <Form {...form}>
      {/* @ts-expect-error - Form's handleSubmit type mismatch with our handler */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-8 ${disabled ? "opacity-75" : ""}`}>
        {/* Sekcja: Status & Język */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Bot Status & Language</h3>
            <p className="text-muted-foreground text-sm">Basic configuration for AI Support Bot.</p>
          </div>

          {/* Bot Status Toggle */}
          <FormField
            // @ts-expect-error - Control type mismatch between RHF and our component
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Bot Status</FormLabel>
                  <FormDescription>Enable or disable the bot for this server</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading || disabled} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Language Selection */}
          <FormField
            // @ts-expect-error - Control type mismatch
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select disabled={isLoading || disabled} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pl">Polish</SelectItem>
                    {/* Add more languages as needed */}
                  </SelectContent>
                </Select>
                <FormDescription>Select the language for bot responses</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sekcja: AI Configuration */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">AI Configuration</h3>
            <p className="text-muted-foreground text-sm">Configure how the AI responds to users.</p>
          </div>

          {/* System Prompt */}
          <FormField
            // @ts-expect-error - Control type mismatch
            control={form.control}
            name="systemPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter custom instructions for the AI..."
                    className="min-h-32 font-mono text-sm"
                    disabled={isLoading || disabled}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Custom instructions that define how the AI should behave. These will be injected as system
                  instructions to the AI.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sekcja: Discord Integration */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Discord Integration</h3>
            <p className="text-muted-foreground text-sm">
              Configure which channels the bot monitors and role mentions.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-medium">Channel Configuration</h4>
            <p className="text-sm text-muted-foreground">
              Choose where the bot should be active. You can select channels from the dropdown list or manually add
              channel/category IDs.
            </p>
          </div>

          {/* Channels MultiSelect */}
          <FormField
            // @ts-expect-error - Control type mismatch
            control={form.control}
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Channels</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}
                        disabled={isLoading || availableChannels.length === 0}
                      >
                        <span className="truncate">
                          {field.value?.length
                            ? `${field.value.length} channel${field.value.length === 1 ? "" : "s"} selected`
                            : "Select channels from list"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                    <Command>
                      <CommandInput placeholder="Search Discord channels..." />
                      <CommandList>
                        <CommandEmpty>No channels found.</CommandEmpty>
                        <CommandGroup>
                          {availableChannels.map((channel) => {
                            const isSelected = field.value?.includes(channel.id);
                            return (
                              <CommandItem
                                key={channel.id}
                                value={channel.name}
                                onSelect={() => {
                                  const currentSelection = field.value || [];
                                  if (isSelected) {
                                    field.onChange(currentSelection.filter((id) => id !== channel.id));
                                  } else {
                                    field.onChange([...currentSelection, channel.id]);
                                  }
                                }}
                              >
                                <Checkbox checked={isSelected} className="mr-2" />
                                <span>#{channel.name}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select which channels the bot will monitor. Currently selected:
                  <div className="mt-2 flex flex-wrap gap-1">
                    {field.value?.map((channelId) => {
                      const channel = availableChannels.find((c) => c.id === channelId);
                      return (
                        <Badge key={channelId} variant="secondary" className="mr-1 mb-1">
                          {channel ? channel.name : channelId}
                        </Badge>
                      );
                    })}
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Manual Channel ID Input */}
          <div className="pt-4 border-t">
            <h4 className="text-base font-medium mb-2">Manual Channel ID Entry</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Paste Discord channel or category IDs where the bot should be active.
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Discord channel/category ID"
                  className="flex-1"
                  id="channelIdInput"
                  type="text"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isLoading}
                  onClick={() => {
                    const input = document.getElementById("channelIdInput") as HTMLInputElement;
                    const channelId = input.value.trim();

                    // Validate that the input is a number (Discord IDs are numeric)
                    const isValidChannelId = /^\d+$/.test(channelId);

                    if (!isValidChannelId && channelId) {
                      // Show error for invalid format
                      input.classList.add("border-red-500");
                      const errorText = document.getElementById("channelIdError");
                      if (errorText) {
                        errorText.textContent = "Channel ID must contain only digits";
                        errorText.classList.remove("hidden");
                      }
                      return;
                    }

                    // Remove error styling if previously shown
                    input.classList.remove("border-red-500");
                    const errorText = document.getElementById("channelIdError");
                    if (errorText) {
                      errorText.classList.add("hidden");
                    }

                    if (channelId && !form.getValues().channels.includes(channelId)) {
                      form.setValue("channels", [...form.getValues().channels, channelId]);
                      input.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <p id="channelIdError" className="text-sm text-red-500 hidden">
                Channel ID must contain only digits
              </p>
              <div className="border rounded-md p-3 space-y-2">
                <p className="text-sm font-medium">Active Channels/Categories:</p>
                {form.watch("channels").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No channels added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {form.watch("channels").map((channelId) => (
                      <Badge key={channelId} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                        <span>{channelId}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            form.setValue(
                              "channels",
                              form.getValues().channels.filter((id) => id !== channelId)
                            );
                          }}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Support Role Selection */}
          <FormField
            // @ts-expect-error - Control type mismatch
            control={form.control}
            name="supportRoleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Role</FormLabel>
                <Select
                  disabled={isLoading || availableRoles.length === 0}
                  onValueChange={field.onChange}
                  // Keep fix for defaultValue
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Role that will be mentioned when tickets are escalated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Manual Role ID Entry */}
          <div className="pt-4 border-t">
            <h4 className="text-base font-medium mb-2">Manual Role ID Entry</h4>
            <p className="text-sm text-muted-foreground mb-4">Paste Discord role ID to assign as the support role.</p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Discord role ID"
                  className="flex-1"
                  id="roleIdInput"
                  type="text"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isLoading}
                  onClick={() => {
                    const input = document.getElementById("roleIdInput") as HTMLInputElement;
                    const roleId = input.value.trim();

                    // Validate that the input is a number (Discord IDs are numeric)
                    const isValidRoleId = /^\d+$/.test(roleId);

                    if (!isValidRoleId && roleId) {
                      // Show error for invalid format
                      input.classList.add("border-red-500");
                      const errorText = document.getElementById("roleIdError");
                      if (errorText) {
                        errorText.textContent = "Role ID must contain only digits";
                        errorText.classList.remove("hidden");
                      }
                      return;
                    }

                    // Remove error styling if previously shown
                    input.classList.remove("border-red-500");
                    const errorText = document.getElementById("roleIdError");
                    if (errorText) {
                      errorText.classList.add("hidden");
                    }

                    if (roleId) {
                      form.setValue("supportRoleId", roleId);
                      input.value = "";
                    }
                  }}
                >
                  Set Role
                </Button>
              </div>
              <p id="roleIdError" className="text-sm text-red-500 hidden">
                Role ID must contain only digits
              </p>
              <div className="border rounded-md p-3 space-y-2">
                <p className="text-sm font-medium">Current Support Role ID:</p>
                {!form.watch("supportRoleId") ? (
                  <p className="text-sm text-muted-foreground">No support role set.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                      <span>{form.watch("supportRoleId")}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          form.setValue("supportRoleId", null);
                        }}
                      >
                        ×
                      </Button>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja: Usage Limits */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Usage Limits</h3>
            <p className="text-muted-foreground text-sm">Set limits for message frequency and length.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Max Messages Per User */}
            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="maxMessagesPerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Messages Per User</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Maximum number of messages a user can send (1-100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Text Length */}
            <FormField
              // @ts-expect-error - Control type mismatch
              control={form.control}
              name="maxTextLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Text Length</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Maximum length of text in characters (100-4000)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t pt-6">
          <Button type="submit" disabled={isLoading || disabled} className="w-full sm:w-auto">
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
