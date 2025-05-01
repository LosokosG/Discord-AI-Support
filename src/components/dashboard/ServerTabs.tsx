import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ServerItem {
  id: string;
  name: string;
  members: number;
  iconLetter: string;
  color: string;
}

interface ServerTabsProps {
  popularServers: ServerItem[];
  recentServers: ServerItem[];
}

export default function ServerTabs({ popularServers, recentServers }: ServerTabsProps) {
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
        {popularServers.map((server) => (
          <a key={server.id} href={`/dashboard/servers/${server.id}`} className="block">
            <Card className="bg-[#2B2D31] hover:bg-[#34363c] border-none transition-all duration-200 hover:shadow-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${server.color}`}
                  >
                    {server.iconLetter}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                    <p className="text-discord-text-muted text-sm">{server.members} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </TabsContent>

      <TabsContent value="recent" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentServers.map((server) => (
          <a key={server.id} href={`/dashboard/servers/${server.id}`} className="block">
            <Card className="bg-[#2B2D31] hover:bg-[#34363c] border-none transition-all duration-200 hover:shadow-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${server.color}`}
                  >
                    {server.iconLetter}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                    <p className="text-discord-text-muted text-sm">{server.members} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </TabsContent>
    </Tabs>
  );
}
