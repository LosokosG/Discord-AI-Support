/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  MessageSquare,
  Users,
  ListTree,
  Database,
  HelpCircle,
  BarChart3,
  Shield,
  ChevronDown,
  Search,
  PlusCircle,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/db/supabase.client";

// Dostosowany typ Server do użycia w komponencie
interface ServerItem {
  id: string;
  name: string;
  active: boolean;
  config?: Record<string, unknown>;
  icon_url: string | null;
  iconLetter?: string;
  color?: string;
  created_at?: string;
}

// Types for navigation items
export interface NavItemType {
  id?: string;
  title: string;
  name?: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: (e: React.MouseEvent) => void;
}

interface SidebarProps {
  className?: string;
  serverId?: string;
}

export default function Sidebar({ className, serverId }: SidebarProps) {
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [currentServer, setCurrentServer] = useState<ServerItem | null>(null);
  const [isServerSelectorOpen, setIsServerSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Wypisz ID serwera do celów debugowania
  console.log("Sidebar component - Server ID prop:", serverId);

  // Check if we're on a server-specific page
  const isServerPage =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/dashboard/servers/") &&
    /\/dashboard\/servers\/[^/]+/.test(window.location.pathname);

  // Fallback to letter avatars with different background colors
  const bgColors = [
    "bg-[#5865F2]", // Discord Blurple
    "bg-[#57F287]", // Discord Green
    "bg-[#FEE75C]", // Discord Yellow
    "bg-[#EB459E]", // Discord Fuchsia
    "bg-[#ED4245]", // Discord Red
  ];

  // Navigation items for the sidebar
  const navItems = [
    {
      title: "Dashboard",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}` : ""}`,
      icon: Home,
    },
    {
      title: "Knowledge Base",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/knowledge` : ""}`,
      icon: Database,
      onClick: (e: React.MouseEvent) => {
        // If server is selected but we're not on a server page, prevent default and force navigation
        if (serverId && !isServerPage) {
          e.preventDefault();
          window.location.href = `/dashboard/servers/${serverId}/knowledge`;
        }
      },
    },
    {
      title: "Modules",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/modules` : ""}`,
      icon: ListTree,
    },
    {
      title: "Commands",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/commands` : ""}`,
      icon: MessageSquare,
    },
    {
      title: "Permissions",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/permissions` : ""}`,
      icon: Shield,
    },
    {
      title: "Members",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/members` : ""}`,
      icon: Users,
    },
    {
      title: "Analytics",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/analytics` : ""}`,
      icon: BarChart3,
    },
    {
      title: "Logs",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/logs` : ""}`,
      icon: Database,
    },
    {
      title: "Settings",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/settings` : ""}`,
      icon: Settings,
    },
    {
      title: "Help & Support",
      href: `/dashboard${isServerPage && serverId ? `/servers/${serverId}/help` : ""}`,
      icon: HelpCircle,
    },
  ];

  useEffect(() => {
    // Pobierz rzeczywiste dane serwerów z bazy danych
    const fetchServers = async () => {
      setLoading(true);
      try {
        // Pobierz serwery z bazy danych przy użyciu klienta Supabase
        const { data, error } = await supabaseClient
          .from("servers")
          .select("id, name, icon_url, active, config, created_at");

        if (error) {
          console.error("Error fetching servers:", error);
          return;
        }

        // Wyświetl dane serwerów dla debugowania
        console.log("Servers retrieved from DB:", data);

        if (!data || data.length === 0) {
          console.warn("No servers found in the database");
          setLoading(false);
          return;
        }

        // Przypisz dane serwerów do stanu
        const fetchedServers = data.map((server) => ({
          ...server,
          // Dodaj literę ikony dla serwerów bez URL ikony
          iconLetter: server.name.charAt(0).toUpperCase(),
          // Przypisz kolor dla avatara
          color: getRandomColor(server.id.toString()),
        })) as ServerItem[];

        setServers(fetchedServers);

        // Znajdź aktualny serwer jeśli mamy serverId
        if (serverId) {
          console.log("Looking for serverId:", serverId);
          const server = fetchedServers.find((s) => String(s.id) === serverId);
          console.log("Found server:", server);
          setCurrentServer(server || null);
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [serverId]);

  // Get a color for server icon background based on server ID
  const getRandomColor = (id: string) => {
    const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgColors.length;
    return bgColors[index];
  };

  // Filter servers based on search query
  const filteredServers = servers.filter((server) => server.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Close the popover when a server is selected
  const closeServerSelector = () => {
    setIsServerSelectorOpen(false);
  };

  return (
    <aside
      className={cn(
        "w-90 bg-[#1a1b1e] text-white h-screen overflow-y-auto py-8 shadow-xl hidden md:flex md:flex-col",
        className
      )}
    >
      <div className="px-6 mb-6">
        <h2 className="text-4xl font-bold px-2 mb-6">AI Support Bot</h2>

        {/* Server Selector */}
        <Popover open={isServerSelectorOpen} onOpenChange={setIsServerSelectorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between py-6 bg-[#2b2d31] border-none hover:bg-[#34363c] transition-colors shadow-md"
            >
              {currentServer ? (
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      currentServer.color || getRandomColor(currentServer.id.toString())
                    )}
                  >
                    {currentServer.icon_url ? (
                      <img src={currentServer.icon_url} alt={currentServer.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <span className="font-bold text-lg text-white">{currentServer.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg truncate text-white">{currentServer.name}</p>
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-gray-300 text-xs">Online</span>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-300">Select a server</span>
              )}
              <ChevronDown className="h-5 w-5 text-gray-300" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 border-none bg-[#2b2d31]" side="bottom">
            <div className="p-3">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search servers..."
                  className="pl-8 bg-[#1e1f22] border-none text-white focus:ring-0 focus:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
                {loading ? (
                  <div className="text-center py-4 text-gray-400">Loading servers...</div>
                ) : filteredServers.length > 0 ? (
                  filteredServers.map((server) => (
                    <a
                      key={server.id}
                      href={`/dashboard/servers/${server.id}`}
                      onClick={closeServerSelector}
                      className={cn(
                        "w-full flex items-center p-2 rounded-md hover:bg-[#34363c] transition-colors",
                        String(server.id) === serverId && "bg-[#34363c]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          server.color || getRandomColor(server.id.toString())
                        )}
                      >
                        {server.icon_url ? (
                          <img src={server.icon_url} alt={server.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <span className="font-bold text-sm text-white">{server.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-white text-sm truncate">{server.name}</span>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-2 text-gray-400 text-sm">No servers found</div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-[#1e1f22]">
                <a
                  href="/dashboard/servers/new"
                  onClick={closeServerSelector}
                  className="w-full flex items-center p-2 rounded-md hover:bg-[#34363c] transition-colors text-[#57F287]"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Add New Server</span>
                </a>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <nav className="space-y-2 px-6 flex-grow overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            onClick={item.onClick}
            className="flex items-center gap-5 px-5 py-3 text-base rounded-lg hover:bg-[#5865F2]/80 transition-all duration-200 group"
          >
            <item.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
            <span className="font-medium">{item.title}</span>
          </a>
        ))}
      </nav>

      <div className="px-6 pt-6 mt-auto">
        <div className="flex items-center gap-5 px-5 py-5 bg-[#2b2d31] rounded-xl shadow-lg">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-xl">U</span>
          </div>
          <div>
            <p className="font-semibold text-xl">Username</p>
            <p className="text-base text-blue-300">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
