import { useState, useEffect } from "react";
import { Server2, Settings, BookOpen, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/components/hooks/useAppState";
import { useSupabase } from "@/components/hooks/useSupabase";
import { getServers } from "@/lib/services/api";
import { toast } from "@/components/ui/sonner";

export default function ServerList() {
  const { state, setServers, setServersLoading, setServersError } = useAppState();
  const supabase = useSupabase();
  const [page, setPage] = useState(1);
  const pageSize = 6; // Number of servers per page

  // Load servers when component mounts or pagination changes
  useEffect(() => {
    async function loadServers() {
      if (!supabase) return;

      setServersLoading(true);
      try {
        const serverList = await getServers(supabase, { page, pageSize });
        setServers(serverList);
      } catch (error) {
        console.error("Error loading servers:", error);
        setServersError("Failed to load servers. Please try again later.");
        toast.error("Failed to load servers. Please try again later.");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discord Servers</h1>
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
          <Server2 className="mx-auto h-12 w-12 text-neutral-400" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.servers?.data.map((server) => (
              <div key={server.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div
                  className={`h-2 w-full rounded-t-lg ${server.active ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"}`}
                ></div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    {server.iconUrl ? (
                      <img
                        src={server.iconUrl}
                        alt={server.name}
                        className="h-10 w-10 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/images/default-server-icon.png";
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <Server2 className="h-5 w-5 text-neutral-500" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold leading-none tracking-tight">{server.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{server.active ? "Bot Active" : "Bot Inactive"}</p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={`/dashboard/servers/${server.id}/settings`}
                      className="inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Server Settings
                    </a>
                    <a
                      href={`/dashboard/servers/${server.id}/knowledge`}
                      className="inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Knowledge Base
                    </a>
                  </div>
                </CardContent>
              </div>
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
