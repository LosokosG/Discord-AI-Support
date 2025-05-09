/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useForm } from "react-hook-form";
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
  // Use any type for the form to bypass the type checking issues
  // This is a workaround for known compatibility issues between react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(serverSettingsSchema) as any,
    defaultValues: {
      ...initialData,
      systemPrompt: initialData.systemPrompt ?? null,
      supportRoleId: initialData.supportRoleId ?? null,
      channels: initialData.channels ?? [],
    },
  });

  // Helper to set field errors
  const setFieldError = (field: keyof ServerSettingsFormValues, message: string) => {
    form.setError(field as any, { message });
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
  const handleFormSubmit = form.handleSubmit((data) => {
    // Cast the data to our expected type
    return onSubmit(data as any as ServerSettingsFormValues, setFieldError);
  });

  // Function to add a channel ID
  const addChannelId = (channelId: string) => {
    if (channelId && !form.getValues().channels?.includes(channelId)) {
      const currentChannels = form.getValues().channels || [];
      form.setValue("channels" as any, [...currentChannels, channelId]);
      return true;
    }
    return false;
  };

  // Function to remove a channel ID
  const removeChannelId = (channelId: string) => {
    const currentChannels = form.getValues().channels || [];
    form.setValue(
      "channels" as any,
      currentChannels.filter((id) => id !== channelId)
    );
  };

  // Function to set support role ID
  const setSupportRoleId = (roleId: string | null) => {
    form.setValue("supportRoleId" as any, roleId);
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
