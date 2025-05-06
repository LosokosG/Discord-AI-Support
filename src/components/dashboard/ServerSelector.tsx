import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ServerCrash, Shield, CircleSlashed, Info, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Server {
  id: string;
  name: string;
  icon_url: string | null;
  permissions: string;
  has_bot: boolean;
  is_admin: boolean;
  active: boolean;
}

interface ServerSelectorProps {
  discordClientId?: string;
}

export default function ServerSelector({ discordClientId = "" }: ServerSelectorProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/servers/list");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load server list");
        }

        const data = await response.json();
        setServers(data.guilds);
      } catch (err: unknown) {
        console.error("Error fetching servers:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  // Filter servers based on search query
  const filteredServers = servers.filter((server) => server.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sort servers: servers with bot first, then the rest
  const sortedServers = [...filteredServers].sort((a, b) => {
    if (a.has_bot && !b.has_bot) return -1;
    if (!a.has_bot && b.has_bot) return 1;
    return a.name.localeCompare(b.name);
  });

  // Generate background color for server icons without an image
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

  // Generate Discord OAuth bot add URL with callback
  const getAddBotUrl = (serverId: string, serverName: string, serverIcon: string | null) => {
    // Get the current site's origin for redirect URL
    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/bot-callback`;

    // Encode server information in the state parameter
    const state = encodeURIComponent(
      JSON.stringify({
        guild_id: serverId,
        guild_name: serverName,
        guild_icon: serverIcon,
      })
    );

    // Standard Discord bot add URL with server pre-selected and our callback
    const url =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${discordClientId}` +
      `&permissions=8` +
      `&scope=bot%20applications.commands` +
      `&guild_id=${serverId}` +
      `&disable_guild_select=true` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}`;

    return url;
  };

  // Loading skeletons
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

  // Error display
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ServerCrash className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-2xl font-bold mb-2">Error Loading Servers</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Generate add server URL for the "Add Bot to New Server" button
  const getAddServerUrl = () => {
    const origin = window.location.origin;
    const redirectUri = `${origin}/auth/bot-callback`;

    return (
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${discordClientId}` +
      `&permissions=8` +
      `&scope=bot%20applications.commands` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Discord Servers</h1>
        <a href={getAddServerUrl()} className="inline-flex items-center">
          <Button className="gap-2 py-6 px-4 bg-[#5865F2] hover:bg-[#4752c4] text-white">
            <PlusCircle className="h-5 w-5" />
            Add Bot to New Server
          </Button>
        </a>
      </div>

      {/* Search bar - made more prominent with improved styling */}
      <div className="relative mb-8">
        <div className="bg-[#f2f3f5] dark:bg-[#2b2d31] rounded-lg p-4 border border-[#5865F2]/20 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5865F2]" />
            <Input
              placeholder="Search servers..."
              className="pl-10 py-6 text-lg bg-background border-[#5865F2]/30 focus-visible:border-[#5865F2] focus-visible:ring-[#5865F2]/25"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* No servers message */}
      {sortedServers.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-background">
          <ServerCrash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Servers Found</h3>
          <p className="text-muted-foreground mb-4">
            No Discord servers found where you have administrator permissions.
          </p>
          <Button asChild size="lg" className="bg-[#5865F2] hover:bg-[#4752c4]">
            <a href={getAddServerUrl()}>Add Bot to a Server</a>
          </Button>
        </div>
      )}

      {/* Server list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedServers.map((server) => (
          <div
            key={server.id}
            className={cn(
              "border rounded-lg p-4 transition-all duration-200",
              server.has_bot
                ? "bg-background hover:border-[#5865F2] hover:shadow-md"
                : "bg-muted/30 border-dashed cursor-default"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className={cn("h-12 w-12", !server.icon_url && getServerColor(server.id))}>
                  {server.icon_url ? (
                    <AvatarImage src={server.icon_url} alt={server.name} />
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

              {!server.has_bot && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <CircleSlashed className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bot not installed on this server</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {server.has_bot ? (
              <div className="mt-4">
                <div className="mb-3 flex items-center">
                  {server.active ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 mr-2">
                      <Bot className="h-3 w-3 mr-1" />
                      Bot Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 mr-2">
                      <CircleSlashed className="h-3 w-3 mr-1" />
                      Bot Inactive
                    </span>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {server.active 
                          ? "Bot is installed and responding to commands" 
                          : "Bot is installed but may have been removed from the server"
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {server.active ? (
                  <a href={`/dashboard/servers/${server.id}`}>
                    <Button className="w-full bg-[#5865F2] hover:bg-[#4752c4]">Manage Server</Button>
                  </a>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`/dashboard/servers/${server.id}`}>
                      <Button className="w-full bg-slate-500 hover:bg-slate-600" variant="secondary">View Config</Button>
                    </a>
                    <a href={getAddBotUrl(server.id, server.name, server.icon_url)} className="w-full">
                      <Button 
                        className="w-full gap-1 bg-[#5865F2] hover:bg-[#4752c4]"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Reinstall
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <div className="p-2 mb-3 bg-muted/50 rounded text-xs text-muted-foreground text-center">
                  Bot not yet installed on this server
                </div>
                <a href={getAddBotUrl(server.id, server.name, server.icon_url)} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border border-[#5865F2] bg-[#5865F2]/5 text-[#5865F2] font-semibold hover:bg-[#5865F2]/10 hover:text-[#5865F2] hover:border-[#5865F2] transition-all"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Bot to Server
                  </Button>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
