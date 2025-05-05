import React from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Topbar component for the dashboard
 * Displays the app title, logo, and a mobile menu toggle button
 */
interface TopbarProps {
  title?: string;
  isMobileSidebarOpen?: boolean;
  setIsMobileSidebarOpen?: (open: boolean) => void;
  serverName?: string;
  serverStatus?: "online" | "offline" | "maintenance" | "unknown";
  username?: string;
}

export default function Topbar({
  title = "AI Support Bot",
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  serverName,
  serverStatus,
  username = "Discord User", // Default username if not provided
}: TopbarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center justify-between py-8 px-8 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 h-40 shadow-xl relative overflow-hidden">
      {/* Left side - Logo and server info */}
      <div className="flex flex-col z-10">
        <div className="flex items-center">
          {setIsMobileSidebarOpen ? (
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden text-white hover:bg-white/20">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
            </Sheet>
          ) : null}
          <div className="h-14 w-14 mr-3 rounded-full bg-white flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-blue-600"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>

        {serverName && serverStatus && (
          <div className="flex items-center mt-2 ml-2">
            <div className={cn("h-3 w-3 rounded-full mr-2", getStatusColor(serverStatus))}></div>
            <div className="text-white text-base font-medium">
              {serverName} • <span className="text-white/80">{getStatusText(serverStatus)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Center - Welcome message */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis px-4">
          Welcome, {username}!
        </h2>
      </div>

      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static larger circles */}
        <div className="absolute -right-10 top-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute left-1/4 bottom-0 w-24 h-24 rounded-full bg-white/5"></div>

        {/* Animated circles */}
        <div className="absolute right-1/4 top-1/3 w-16 h-16 rounded-full bg-white/5 animate-float-slow"></div>
        <div className="absolute left-1/3 top-1/2 w-12 h-12 rounded-full bg-white/5 animate-float-slower"></div>
        <div className="absolute right-1/2 bottom-5 w-20 h-20 rounded-full bg-white/5 animate-float-slowest"></div>
        <div className="absolute left-10 top-10 w-14 h-14 rounded-full bg-white/5 animate-float-slow-reverse"></div>
        <div className="absolute right-20 bottom-10 w-10 h-10 rounded-full bg-white/5 animate-float-slower-reverse"></div>
        <div className="absolute left-1/2 top-5 w-8 h-8 rounded-full bg-white/5 animate-float-slowest-reverse"></div>
      </div>

      {/* Right side - Action buttons */}
      <div className="hidden md:flex items-center space-x-4 z-10">
        <Button variant="ghost" className="text-white hover:bg-white/20 text-lg h-12 px-6 font-medium">
          Help
        </Button>
        <Button variant="ghost" className="text-white hover:bg-white/20 text-lg h-12 px-6 font-medium">
          Documentation
        </Button>
      </div>
    </div>
  );
}
