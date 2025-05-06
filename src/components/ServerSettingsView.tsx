import { useState, useEffect } from "react";
import { ServerSettingsHeader } from "./ServerSettingsHeader";
import { ServerSettingsForm, type FieldError } from "./ServerSettingsForm";
import { toast } from "./ui/sonner";
import type { ServerDetail, UpdateServerCommand, ErrorResponse } from "../types";
import type { ChannelOption, RoleOption } from "../types/discord";
import { fetchDiscordChannels, fetchDiscordRoles } from "../lib/discord-helpers";

interface ServerSettingsViewModel {
  enabled: boolean;
  language: string;
  systemPrompt: string | null;
  channels: string[];
  supportRoleId: string | null;
  maxMessagesPerUser: number;
  maxTextLength: number;
}

interface ServerConfig {
  language?: string;
  systemPrompt?: string;
  channels?: string[];
  support_role_id?: string;
  maxMessagesPerUser?: number;
  maxTextLength?: number;
}

const mapDetailToViewModel = (detail: ServerDetail): ServerSettingsViewModel => {
  const config = (detail.config as ServerConfig) || {};
  return {
    enabled: detail.active,
    language: config.language || "en",
    systemPrompt: config.systemPrompt ?? null,
    channels: config.channels || [],
    supportRoleId: config.support_role_id ?? null,
    maxMessagesPerUser: config.maxMessagesPerUser || 10,
    maxTextLength: config.maxTextLength || 2000,
  };
};

const mapViewModelToCommand = (viewModel: ServerSettingsViewModel): UpdateServerCommand => {
  return {
    active: viewModel.enabled,
    config: {
      language: viewModel.language,
      systemPrompt: viewModel.systemPrompt === null ? undefined : viewModel.systemPrompt,
      channels: viewModel.channels,
      support_role_id: viewModel.supportRoleId === null ? undefined : viewModel.supportRoleId,
      maxMessagesPerUser: viewModel.maxMessagesPerUser,
      maxTextLength: viewModel.maxTextLength,
    },
  };
};

export const ServerSettingsView = ({ serverId }: { serverId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ServerDetail | null>(null);
  const [viewModel, setViewModel] = useState<ServerSettingsViewModel | null>(null);
  const [availableChannels, setAvailableChannels] = useState<ChannelOption[]>([]);
  const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  // Fetch server data, channels, and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch server details
        const serverResponse = await fetch(`/api/servers/${serverId}`);
        if (!serverResponse.ok) {
          throw new Error(`Error fetching server data: ${serverResponse.statusText}`);
        }
        const serverDetails: ServerDetail = await serverResponse.json();
        setServerData(serverDetails);
        setViewModel(mapDetailToViewModel(serverDetails));

        // Fetch available channels using our helper function
        try {
          const channelsData = await fetchDiscordChannels(serverId);
          setAvailableChannels(channelsData);
        } catch (channelErr) {
          console.error("Error fetching channels:", channelErr);
          toast.warning("Could not load channel list. Please try again later.");
        }

        // Fetch available roles using our helper function
        try {
          const rolesData = await fetchDiscordRoles(serverId);
          setAvailableRoles(rolesData);
        } catch (roleErr) {
          console.error("Error fetching roles:", roleErr);
          toast.warning("Could not load role list. Please try again later.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        toast.error("Failed to load server data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serverId]);

  const handleSave = async (
    data: ServerSettingsViewModel,
    setFieldError: (field: keyof ServerSettingsViewModel, message: string) => void
  ) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors([]);

    try {
      const command = mapViewModelToCommand(data);
      const response = await fetch(`/api/servers/${serverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        let errorMessage = `Error saving server data: ${response.statusText}`;
        // Check for detailed error response
        try {
          const errorData: ErrorResponse = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error.message;
            // Obsługa szczegółowych błędów walidacji z API
            if (errorData.error.details && errorData.error.details.length > 0) {
              const newFieldErrors: FieldError[] = [];

              errorData.error.details.forEach((detail) => {
                // Konwersja nazw pól z backendu do frontendowych (jeśli potrzebne)
                const fieldName = mapBackendFieldToFrontend(detail.field);

                // Ustawienie błędu dla konkretnego pola w formularzu
                if (fieldName) {
                  setFieldError(fieldName as keyof ServerSettingsViewModel, detail.message);
                  newFieldErrors.push({
                    field: fieldName as keyof ServerSettingsViewModel,
                    message: detail.message,
                  });
                }
              });

              // Zaktualizuj stan błędów pól
              setFieldErrors(newFieldErrors);
            }
          }
        } catch {
          // Ignore if response is not JSON or doesn't match ErrorResponse
        }
        throw new Error(errorMessage);
      }

      const updatedData: ServerDetail = await response.json();
      setServerData(updatedData);
      setViewModel(mapDetailToViewModel(updatedData));
      toast.success("Server settings saved successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error saving settings";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper do mapowania nazw pól z backendu na frontendowe
  const mapBackendFieldToFrontend = (backendField: string): string | null => {
    // Mapa konwersji nazw pól
    const fieldMapping: Record<string, keyof ServerSettingsViewModel> = {
      "config.language": "language",
      "config.systemPrompt": "systemPrompt",
      "config.channels": "channels",
      "config.support_role_id": "supportRoleId",
      "config.maxMessagesPerUser": "maxMessagesPerUser",
      "config.maxTextLength": "maxTextLength",
      active: "enabled",
    };

    return fieldMapping[backendField] || null;
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/servers/${serverId}/activate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error activating server: ${response.statusText}`);
      }

      if (serverData) {
        const updatedData = { ...serverData, active: true };
        setServerData(updatedData);
        setViewModel((prev) => (prev ? { ...prev, enabled: true } : null));
      }
      toast.success("Server activated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to activate server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/servers/${serverId}/deactivate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error deactivating server: ${response.statusText}`);
      }

      if (serverData) {
        const updatedData = { ...serverData, active: false };
        setServerData(updatedData);
        setViewModel((prev) => (prev ? { ...prev, enabled: false } : null));
      }
      toast.success("Server deactivated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to deactivate server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/servers/${serverId}/refresh-config`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error refreshing config: ${response.statusText}`);
      }

      toast.success("Server configuration refreshed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to refresh server configuration");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !serverData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && !serverData) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!serverData || !viewModel) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Server not found or data could not be loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <ServerSettingsHeader
        server={serverData}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {!serverData.active && (
        <div className="bg-amber-100 text-amber-800 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 mt-0.5">⚠️</div>
            <div>
              <h3 className="font-semibold">Bot not active in this server</h3>
              <p className="text-sm">
                The bot appears to have been removed from this server. You can view settings but changes won't apply
                until the bot is reinstalled.
              </p>
            </div>
          </div>
          <a
            href={`/dashboard/servers/${serverId}`}
            className="whitespace-nowrap px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium"
          >
            Back to dashboard
          </a>
        </div>
      )}

      <ServerSettingsForm
        initialData={viewModel}
        onSubmit={handleSave}
        isLoading={isLoading}
        availableChannels={availableChannels}
        availableRoles={availableRoles}
        initialErrors={fieldErrors}
        disabled={!serverData.active}
      />
    </div>
  );
};
