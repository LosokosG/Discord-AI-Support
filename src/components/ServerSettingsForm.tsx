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
}

// Form validation schema using zod
const formSchema = z.object({
  enabled: z.boolean(),
  language: z.string().min(1, { message: "Language is required" }),
  systemPrompt: z.string().nullable().optional(),
  channels: z.array(z.string()).default([]),
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
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
                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
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
                    disabled={isLoading}
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

          {/* Channels MultiSelect */}
          <FormField
            // @ts-expect-error - Control type mismatch
            control={form.control}
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channels</FormLabel>
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
                            : "Select channels"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                    <Command>
                      <CommandInput placeholder="Search channels..." />
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
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.value?.length ? (
                      field.value.map((channelId) => {
                        const channel = availableChannels.find((c) => c.id === channelId);
                        return (
                          <Badge key={channelId} variant="secondary">
                            #{channel ? channel.name : channelId}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground italic text-sm">None</span>
                    )}
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
