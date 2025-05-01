import { useState, useEffect } from "react";
import type { Server, ServerDetail } from "@/types";
import { apiClient } from "@/lib/services/api-client";

interface UseServerDataResult {
  server: ServerDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage server data
 * @param serverId - ID of the server to fetch
 * @returns Object containing server data, loading state, error, and refetch function
 */
export function useServerData(serverId: string | number): UseServerDataResult {
  const [server, setServer] = useState<ServerDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServer = async (): Promise<void> => {
    if (!serverId) {
      setError("Server ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getServer(serverId.toString());
      setServer(data);
    } catch (e) {
      console.error("Error fetching server:", e);
      setError(e instanceof Error ? e.message : "Failed to load server data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServer();
  }, [serverId]);

  return {
    server,
    loading,
    error,
    refetch: fetchServer,
  };
}

/**
 * Hook to fetch and manage servers list
 * @returns Object containing servers list, loading state, error, and refetch function
 */
export function useServers(
  page = 1,
  pageSize = 10
): {
  servers: Server[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
} {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchServers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getServers(page, pageSize);
      setServers(response.data);
      setTotal(response.total);
    } catch (e) {
      console.error("Error fetching servers:", e);
      setError(e instanceof Error ? e.message : "Failed to load servers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [page, pageSize]);

  return {
    servers,
    loading,
    error,
    total,
    refetch: fetchServers,
  };
}
