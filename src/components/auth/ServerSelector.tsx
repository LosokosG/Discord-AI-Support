import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../ui/icons";
import { Skeleton } from "../ui/skeleton";

interface DiscordServer {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  hasBot?: boolean;
}

export function ServerSelector() {
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        // In a real implementation, this would call the actual API endpoint
        // For now, we'll simulate a delay and return mock data
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock server data for UI demonstration
        const mockServers: DiscordServer[] = [
          {
            id: "123456789",
            name: "Serwer Demo 1",
            icon: null,
            owner: true,
            permissions: "1099511627775", // Admin permission flag
            hasBot: true,
          },
          {
            id: "987654321",
            name: "Serwer Demo 2",
            icon: null,
            owner: false,
            permissions: "1099511627775", // Admin permission flag
            hasBot: false,
          },
          {
            id: "456789123",
            name: "Serwer Demo 3",
            icon: null,
            owner: true,
            permissions: "0", // No admin permission
            hasBot: false,
          },
        ];

        setServers(mockServers);
      } catch (error) {
        console.error("Error fetching servers:", error);
        setError("Nie udało się pobrać listy serwerów. Spróbuj ponownie.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServers();
  }, []);

  const handleSelectServer = (serverId: string) => {
    // In a real implementation, this would navigate to the dashboard for this server
    window.location.href = `/dashboard/${serverId}`;
  };

  const isAdmin = (server: DiscordServer) => {
    const permissions = BigInt(server.permissions);
    const adminPermission = BigInt(1 << 3); // ADMINISTRATOR permission (1 << 3)
    return (permissions & adminPermission) === adminPermission;
  };

  const getServerIcon = (server: DiscordServer) => {
    if (server.icon) {
      return `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`;
    }

    // Generate a simple color based on the server name for the fallback
    const nameHash = server.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

    return null; // Return null to use the AvatarFallback
  };

  const getServerInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="text-center py-8">
        <Icons.serverOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Brak dostępnych serwerów</h3>
        <p className="text-muted-foreground mb-4">
          Nie znaleziono serwerów, na których masz uprawnienia administratora.
        </p>
        <Button asChild>
          <a href="https://discord.com/api/oauth2/authorize">
            <Icons.plus className="mr-2 h-4 w-4" />
            Dodaj bota do serwera
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {servers.map((server) => {
        const hasAdminPermission = isAdmin(server);

        return (
          <Button
            key={server.id}
            variant="outline"
            className={`flex items-center justify-between w-full p-4 h-auto ${!hasAdminPermission ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => hasAdminPermission && handleSelectServer(server.id)}
            disabled={!hasAdminPermission}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getServerIcon(server) || ""} alt={server.name} />
                <AvatarFallback>{getServerInitials(server.name)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium">{server.name}</div>
                <div className="text-xs text-muted-foreground">
                  {server.hasBot ? (
                    <span className="flex items-center text-green-600">
                      <Icons.check className="h-3 w-3 mr-1" /> Bot zainstalowany
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {hasAdminPermission ? "Kliknij, aby dodać bota" : "Wymagane uprawnienia administratora"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {hasAdminPermission && <Icons.chevronRight className="h-4 w-4" />}
          </Button>
        );
      })}
    </div>
  );
}
