/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { Server, PlusCircle, Loader2, Search, ServerOff, Shield, CircleSlashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/hooks/useAppState";
import { useSupabase } from "@/components/hooks/useSupabase";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Server {
  id: string;
  name: string;
  iconUrl: string | null;
  permissions?: string;
  active: boolean;
  is_admin?: boolean;
}

export default function ServerList() {
  const { state, setServers, setServersLoading, setServersError } = useAppState();
  const supabase = useSupabase();
  const [page, setPage] = useState(1);
  const pageSize = 6; // Number of servers per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load servers when component mounts or pagination changes
  useEffect(() => {
    async function loadServers() {
      if (!supabase) return;

      try {
        setLoading(true);
        setError(null);
        setServersLoading(true);

        const response = await fetch("/api/servers/list");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Nie udało się pobrać listy serwerów");
        }

        const data = await response.json();

        // Update both local and global state
        setServers(data);
        setLoading(false);
        setServersLoading(false);
      } catch (err) {
        console.error("Error fetching servers:", err);
        const errorMessage = err instanceof Error ? err.message : "Wystąpił nieznany błąd";
        setError(errorMessage);
        setServersError(errorMessage);
        toast.error("Failed to load servers. Please try again later.");
      } finally {
        setLoading(false);
        setServersLoading(false);
      }
    }

    loadServers();
  }, [supabase, page, setServers, setServersLoading, setServersError]);

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (state.servers && page < Math.ceil(state.servers.total / pageSize)) {
      setPage(page + 1);
    }
  };

  // Filter servers based on search query
  const filteredServers = state.servers?.data
    ? state.servers.data.filter((server) => server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Sort servers: those with bot first, then the rest
  const sortedServers = [...filteredServers].sort((a, b) => {
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;
    return a.name.localeCompare(b.name);
  });

  // Function to generate background color for server avatar without icon
  const getServerColor = (id: string) => {
    const colors = [
      "bg-[#5865F2]", // Discord Blurple
      "bg-[#57F287]", // Discord Green
      "bg-[#FEE75C]", // Discord Yellow
      "bg-[#EB459E]", // Discord Fuchsia
      "bg-[#ED4245]", // Discord Red
    ];

    const colorIndex = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

    return colors[colorIndex];
  };

  // Rendering skeletons during loading
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-background">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Display error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ServerOff className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-2xl font-bold mb-2">Błąd podczas pobierania serwerów</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Spróbuj ponownie</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Twoje serwery Discord</h1>
          <p className="text-muted-foreground">Select a server to manage its settings and knowledge base</p>
        </div>
        <a
          href="/dashboard/servers/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Server
        </a>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj serwerów..."
          className="pl-10"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      {state.error.servers && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error: {state.error.servers}</p>
          <p className="text-sm mt-1">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      )}

      {state.isLoading.servers ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading servers...</span>
        </div>
      ) : state.servers?.data.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800">
          <Server className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold">No servers found</h3>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Get started by adding your first Discord server.
          </p>
          <a
            href="/dashboard/servers/new"
            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Server
          </a>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedServers.map((server) => (
              <a
                key={server.id}
                href={server.active ? `/dashboard/servers/${server.id}` : undefined}
                className={cn(
                  "border rounded-lg p-4 transition-all duration-200 block",
                  server.active
                    ? "bg-background hover:border-primary cursor-pointer"
                    : "bg-muted/30 border-dashed pointer-events-none"
                )}
                aria-disabled={!server.active}
                role="button"
                tabIndex={server.active ? 0 : -1}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className={cn("h-12 w-12", !server.iconUrl && getServerColor(server.id))}>
                      {server.iconUrl ? (
                        <AvatarImage src={server.iconUrl} alt={server.name} />
                      ) : (
                        <AvatarFallback>{server.name.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{server.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Administrator</span>
                      </div>
                    </div>
                  </div>

                  {!server.active && (
                    <div className="flex flex-col items-end">
                      <CircleSlashed className="h-5 w-5 text-muted-foreground mb-1" />
                      <a
                        href="https://discord.com/api/oauth2/authorize"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Dodaj bota
                      </a>
                    </div>
                  )}
                </div>

                {server.active && (
                  <div className="mt-2 text-right">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Bot aktywny
                    </span>
                  </div>
                )}

                {!server.active && (
                  <div className="mt-4 p-2 bg-muted/50 rounded text-xs text-muted-foreground text-center">
                    Bot nie jest zainstalowany na tym serwerze
                  </div>
                )}
              </a>
            ))}
          </div>

          {/* Pagination */}
          {state.servers && state.servers.total > pageSize && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" onClick={handlePrevPage} disabled={page <= 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={page >= Math.ceil(state.servers.total / pageSize)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
