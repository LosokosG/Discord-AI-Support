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

// Dostosowany typ Server do użycia w komponencie
interface ServerItem {
  id: string;
  name: string;
  active: boolean;
  config: { language: string };
  iconUrl: string | null;
}

// Types for navigation items
export interface NavItemType {
  id: string;
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
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
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}`,
      icon: Home,
    },
    {
      title: "Modules",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/modules`,
      icon: ListTree,
    },
    {
      title: "Commands",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/commands`,
      icon: MessageSquare,
    },
    {
      title: "Permissions",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/permissions`,
      icon: Shield,
    },
    {
      title: "Members",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/members`,
      icon: Users,
    },
    {
      title: "Analytics",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/analytics`,
      icon: BarChart3,
    },
    {
      title: "Logs",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/logs`,
      icon: Database,
    },
    {
      title: "Settings",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/settings`,
      icon: Settings,
    },
    {
      title: "Help & Support",
      href: `/dashboard${serverId ? `/servers/${serverId}` : ""}/help`,
      icon: HelpCircle,
    },
  ];

  useEffect(() => {
    // W rzeczywistej implementacji, pobieralibyśmy dane serwerów z API
    const fetchServers = async () => {
      try {
        // Docelowo: const response = await fetch('/api/servers');
        // Docelowo: const data = await response.json();

        // Mock danych na czas developmentu
        const mockServers: ServerItem[] = [
          {
            id: "123456789",
            name: "AI Support Test",
            active: true,
            config: { language: "pl" },
            iconUrl: null,
          },
          {
            id: "987654321",
            name: "Development",
            active: false,
            config: { language: "en" },
            iconUrl: null,
          },
          {
            id: "555555555",
            name: "Community Server",
            active: true,
            config: { language: "en" },
            iconUrl: null,
          },
          {
            id: "111222333",
            name: "Gaming Club",
            active: false,
            config: { language: "en" },
            iconUrl: null,
          },
          {
            id: "444555666",
            name: "Study Group",
            active: false,
            config: { language: "en" },
            iconUrl: null,
          },
        ];

        // Symulacja opóźnienia sieci
        setTimeout(() => {
          setServers(mockServers);

          // Find the current server if we have a serverId
          if (serverId) {
            const server = mockServers.find((s) => s.id === serverId);
            setCurrentServer(server || null);
          }
        }, 500);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchServers();
  }, [serverId]);

  // Get a random color for server icon background
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
                      getRandomColor(currentServer.id)
                    )}
                  >
                    {currentServer.iconUrl ? (
                      <img src={currentServer.iconUrl} alt={currentServer.name} className="w-8 h-8 rounded-full" />
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
                {filteredServers.map((server) => (
                  <a
                    key={server.id}
                    href={`/dashboard/servers/${server.id}`}
                    onClick={closeServerSelector}
                    className={cn(
                      "w-full flex items-center p-2 rounded-md hover:bg-[#34363c] transition-colors",
                      server.id === serverId && "bg-[#34363c]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        getRandomColor(server.id)
                      )}
                    >
                      {server.iconUrl ? (
                        <img src={server.iconUrl} alt={server.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <span className="font-bold text-sm text-white">{server.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-white text-sm truncate">{server.name}</span>
                  </a>
                ))}
                {filteredServers.length === 0 && (
                  <div className="text-center py-2 text-gray-400 text-sm">No servers found</div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-[#1e1f22]">
                <a
                  href="/dashboard/servers/new"
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
