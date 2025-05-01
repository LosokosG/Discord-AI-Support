import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ServerItem {
  id: number | string;
  name: string;
  members: number;
  iconLetter: string;
  color: string;
  icon_url: string | null;
  active: boolean;
  created_at: string;
}

interface ServerTabsProps {
  servers: ServerItem[];
}

export default function ServerTabs({ servers }: ServerTabsProps) {
  // Debugowanie - wypisz wszystkie serwery do konsoli
  console.log("ServerTabs component - Servers:", servers);

  // Sort servers by members count to determine popular ones
  const popularServers = [...servers].sort((a, b) => b.members - a.members).slice(0, 6);

  // Sort servers by created_at to determine recent ones
  const recentServers = [...servers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <Tabs defaultValue="popular" className="w-full">
      <TabsList className="bg-[#2B2D31] mb-6">
        <TabsTrigger value="popular" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
          Popular
        </TabsTrigger>
        <TabsTrigger value="recent" className="data-[state=active]:bg-[#5865F2] data-[state=active]:text-white">
          Recent
        </TabsTrigger>
      </TabsList>

      <TabsContent value="popular" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {popularServers.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-discord-text-muted">
            No servers found. Add a new server to get started.
          </div>
        ) : (
          popularServers.map((server) => (
            <div key={String(server.id)} className="block">
              <a href={`/dashboard/servers/${server.id}`} className="block">
                <Card className="bg-[#2B2D31] hover:bg-[#34363c] border-none transition-all duration-200 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {server.icon_url ? (
                        <img src={server.icon_url} alt={server.name} className="h-14 w-14 rounded-full object-cover" />
                      ) : (
                        <div
                          className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${server.color}`}
                        >
                          {server.iconLetter}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                        <p className="text-discord-text-muted text-sm">{server.members} members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          ))
        )}
      </TabsContent>

      <TabsContent value="recent" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentServers.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-discord-text-muted">
            No servers found. Add a new server to get started.
          </div>
        ) : (
          recentServers.map((server) => (
            <div key={String(server.id)} className="block">
              <a href={`/dashboard/servers/${server.id}`} className="block">
                <Card className="bg-[#2B2D31] hover:bg-[#34363c] border-none transition-all duration-200 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {server.icon_url ? (
                        <img src={server.icon_url} alt={server.name} className="h-14 w-14 rounded-full object-cover" />
                      ) : (
                        <div
                          className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${server.color}`}
                        >
                          {server.iconLetter}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                        <p className="text-discord-text-muted text-sm">{server.members} members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
