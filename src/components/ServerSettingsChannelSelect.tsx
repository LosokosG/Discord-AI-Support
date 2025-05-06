import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";

interface ChannelOption {
  id: string;
  name: string;
}

interface ServerSettingsChannelSelectProps {
  channels: string[];
  availableChannels: ChannelOption[];
  onChange: (channels: string[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ServerSettingsChannelSelect({
  channels,
  availableChannels,
  onChange,
  isLoading = false,
  disabled = false,
}: ServerSettingsChannelSelectProps) {
  const [manualInput, setManualInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Clear input error when manual input changes
  useEffect(() => {
    if (inputError && manualInput.length === 0) {
      setInputError(null);
    }
  }, [manualInput, inputError]);

  // Handle manual channel ID addition
  const handleAddChannelId = () => {
    const channelId = manualInput.trim();

    // Validate that the input is a number (Discord IDs are numeric)
    const isValidChannelId = /^\d+$/.test(channelId);

    if (!isValidChannelId && channelId) {
      setInputError("Channel ID must contain only digits");
      return;
    }

    setInputError(null);

    if (channelId && !channels.includes(channelId)) {
      onChange([...channels, channelId]);
      setManualInput("");
    }
  };

  // Handle channel selection from dropdown
  const handleSelectChannel = (channelId: string) => {
    const isSelected = channels.includes(channelId);

    if (isSelected) {
      onChange(channels.filter((id) => id !== channelId));
    } else {
      onChange([...channels, channelId]);
    }
  };

  // Handle channel removal
  const handleRemoveChannel = (channelId: string) => {
    onChange(channels.filter((id) => id !== channelId));
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Active Channels</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn("w-full justify-between", !channels.length && "text-muted-foreground")}
                disabled={isLoading || availableChannels.length === 0 || disabled}
              >
                <span className="truncate">
                  {channels.length
                    ? `${channels.length} channel${channels.length === 1 ? "" : "s"} selected`
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
                    const isSelected = channels.includes(channel.id);
                    return (
                      <CommandItem
                        key={channel.id}
                        value={channel.name}
                        onSelect={() => handleSelectChannel(channel.id)}
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
            {channels.map((channelId) => {
              const channel = availableChannels.find((c) => c.id === channelId);
              return (
                <Badge key={channelId} variant="secondary" className="mr-1 mb-1 flex items-center gap-1 pl-2 pr-1 py-1">
                  <span>{channel ? channel.name : channelId}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveChannel(channelId)}
                    disabled={disabled}
                  >
                    ×
                  </Button>
                </Badge>
              );
            })}
          </div>
        </FormDescription>
        <FormMessage />
      </FormItem>

      <div className="border-t pt-4">
        <h4 className="text-base font-medium mb-2">Manual Channel ID Entry</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Paste Discord channel or category IDs where the bot should be active.
        </p>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Discord channel/category ID"
              className={cn("flex-1", inputError && "border-destructive")}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              disabled={isLoading || disabled}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddChannelId}
              disabled={isLoading || disabled || !manualInput.trim()}
            >
              Add
            </Button>
          </div>
          {inputError && <p className="text-sm text-destructive">{inputError}</p>}
        </div>
      </div>
    </div>
  );
}
