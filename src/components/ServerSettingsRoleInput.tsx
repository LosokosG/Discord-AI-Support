import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "../lib/utils";

interface RoleOption {
  id: string;
  name: string;
}

interface ServerSettingsRoleInputProps {
  roleId: string | null;
  availableRoles: RoleOption[];
  onChange: (roleId: string | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ServerSettingsRoleInput({
  roleId,
  availableRoles,
  onChange,
  isLoading = false,
  disabled = false,
}: ServerSettingsRoleInputProps) {
  const [manualInput, setManualInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Handle role selection from dropdown
  const handleRoleSelect = (selectedRoleId: string) => {
    onChange(selectedRoleId);
  };

  // Handle manual role ID entry
  const handleSetRoleId = () => {
    const enteredRoleId = manualInput.trim();

    // Validate that the input is a number (Discord IDs are numeric)
    const isValidRoleId = /^\d+$/.test(enteredRoleId);

    if (!isValidRoleId && enteredRoleId) {
      setInputError("Role ID must contain only digits");
      return;
    }

    setInputError(null);

    if (enteredRoleId) {
      onChange(enteredRoleId);
      setManualInput("");
    }
  };

  // Handle role removal
  const handleRemoveRole = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Support Role</FormLabel>
        <Select
          disabled={isLoading || availableRoles.length === 0 || disabled}
          onValueChange={handleRoleSelect}
          value={roleId || undefined}
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

      <div className="border-t pt-4">
        <h4 className="text-base font-medium mb-2">Manual Role ID Entry</h4>
        <p className="text-sm text-muted-foreground mb-4">Paste Discord role ID to assign as the support role.</p>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Discord role ID"
              className={cn("flex-1", inputError && "border-destructive")}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              disabled={isLoading || disabled}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleSetRoleId}
              disabled={isLoading || disabled || !manualInput.trim()}
            >
              Set Role
            </Button>
          </div>
          {inputError && <p className="text-sm text-destructive">{inputError}</p>}
          <div className="border rounded-md p-3 space-y-2">
            <p className="text-sm font-medium">Current Support Role ID:</p>
            {!roleId ? (
              <p className="text-sm text-muted-foreground">No support role set.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                  <span>{roleId}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleRemoveRole}
                    disabled={disabled}
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
  );
}
