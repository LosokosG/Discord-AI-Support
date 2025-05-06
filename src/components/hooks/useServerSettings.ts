import * as React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema using zod
export const serverSettingsSchema = z.object({
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

export type ServerSettingsFormValues = z.infer<typeof serverSettingsSchema>;

// Define types for field errors
export interface FieldError {
  field: keyof ServerSettingsFormValues;
  message: string;
}

interface UseServerSettingsProps {
  initialData: ServerSettingsFormValues;
  initialErrors?: FieldError[];
  onSubmit: (
    data: ServerSettingsFormValues,
    setFieldError: (field: keyof ServerSettingsFormValues, message: string) => void
  ) => Promise<void>;
}

export function useServerSettings({ initialData, initialErrors = [], onSubmit }: UseServerSettingsProps) {
  // Cast the resolver to avoid TypeScript errors with the default values
  // This is a known issue with react-hook-form and zod integration
  const form = useForm<ServerSettingsFormValues>({
    // @ts-expect-error - Type mismatch between Zod resolver and React Hook Form
    resolver: zodResolver(serverSettingsSchema),
    defaultValues: {
      ...initialData,
      systemPrompt: initialData.systemPrompt ?? null,
      supportRoleId: initialData.supportRoleId ?? null,
      channels: initialData.channels ?? [],
    },
  });

  // Helper to set field errors
  const setFieldError = (field: keyof ServerSettingsFormValues, message: string) => {
    form.setError(field, { message });
  };

  // Apply initial errors
  React.useEffect(() => {
    if (initialErrors.length > 0) {
      initialErrors.forEach((error) => {
        setFieldError(error.field, error.message);
      });
    }
  }, [initialErrors]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrap the onSubmit function to handle the form data
  const handleFormSubmit = form.handleSubmit((data: ServerSettingsFormValues) => {
    return onSubmit(data, setFieldError);
  });

  // Function to add a channel ID
  const addChannelId = (channelId: string) => {
    if (channelId && !form.getValues().channels.includes(channelId)) {
      form.setValue("channels", [...form.getValues().channels, channelId]);
      return true;
    }
    return false;
  };

  // Function to remove a channel ID
  const removeChannelId = (channelId: string) => {
    form.setValue(
      "channels",
      form.getValues().channels.filter((id) => id !== channelId)
    );
  };

  // Function to set support role ID
  const setSupportRoleId = (roleId: string | null) => {
    form.setValue("supportRoleId", roleId);
  };

  // Validate if a Discord ID is valid (only digits)
  const validateDiscordId = (id: string): boolean => {
    return /^\d+$/.test(id);
  };

  return {
    form,
    handleSubmit: handleFormSubmit,
    addChannelId,
    removeChannelId,
    setSupportRoleId,
    validateDiscordId,
    watch: form.watch,
    getValues: form.getValues,
    setValue: form.setValue,
  };
}
