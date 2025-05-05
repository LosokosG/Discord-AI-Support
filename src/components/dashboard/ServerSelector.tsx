import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ServerCrash, Shield, CircleSlashed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Server {
  id: string;
  name: string;
  icon_url: string | null;
  permissions: string;
  has_bot: boolean;
  is_admin: boolean;
}

export default function ServerSelector() {
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
          throw new Error(errorData.error || "Nie udało się pobrać listy serwerów");
        }

        const data = await response.json();
        setServers(data.guilds);
      } catch (err) {
        console.error("Error fetching servers:", err);
        setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  // Filtrowanie serwerów na podstawie wyszukiwania
  const filteredServers = servers.filter((server) => server.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sortowanie serwerów: najpierw te z botem, potem reszta
  const sortedServers = [...filteredServers].sort((a, b) => {
    if (a.has_bot && !b.has_bot) return -1;
    if (!a.has_bot && b.has_bot) return 1;
    return a.name.localeCompare(b.name);
  });

  // Funkcja generująca kolor tła dla avatara serwera bez ikony
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

  // Renderowanie skeletonów podczas ładowania
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

  // Wyświetlanie błędu
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ServerCrash className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-2xl font-bold mb-2">Błąd podczas pobierania serwerów</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Spróbuj ponownie</Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Twoje serwery Discord</h1>
        <a
          href="https://discord.com/api/oauth2/authorize"
          className="inline-flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Dodaj nowy serwer
          </Button>
        </a>
      </div>

      {/* Wyszukiwarka */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj serwerów..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Komunikat gdy brak serwerów */}
      {sortedServers.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-background">
          <ServerCrash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Brak serwerów</h3>
          <p className="text-muted-foreground mb-4">
            Nie znaleziono żadnych serwerów Discord, na których masz uprawnienia administratora.
          </p>
          <Button asChild variant="outline">
            <a href="https://discord.com/api/oauth2/authorize" target="_blank" rel="noopener noreferrer">
              Dodaj bota do serwera
            </a>
          </Button>
        </div>
      )}

      {/* Lista serwerów */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedServers.map((server) => (
          <a
            key={server.id}
            href={server.has_bot ? `/dashboard/servers/${server.id}` : "#"}
            onClick={(e) => {
              if (!server.has_bot) {
                e.preventDefault();
              }
            }}
            className={cn(
              "block border rounded-lg p-4 transition-all duration-200",
              server.has_bot ? "bg-background hover:border-primary" : "bg-muted/30 border-dashed cursor-default"
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

            {server.has_bot && (
              <div className="mt-2 text-right">
                <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Bot aktywny
                </span>
              </div>
            )}

            {!server.has_bot && (
              <div className="mt-4 p-2 bg-muted/50 rounded text-xs text-muted-foreground text-center">
                Bot nie jest zainstalowany na tym serwerze
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
