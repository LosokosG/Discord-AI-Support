import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NavItemType } from "./Sidebar";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawerProps {
  items: NavItemType[];
  activeItemId?: string;
  isOpen: boolean;
  onClose: () => void;
  serverId?: string;
}

export default function Drawer({ items, activeItemId, isOpen: initialIsOpen, onClose, serverId }: DrawerProps) {
  // Wewnętrzny stan, kontrolowany przez zdarzenia z DashboardLayout
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialIsOpen);

  // Nasłuchuj na zdarzenia z DashboardLayout (aktualizacja stanu z zewnątrz)
  useEffect(() => {
    const handleDrawerUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isOpen === "boolean") {
        setIsDrawerOpen(detail.isOpen);
      }
    };

    document.addEventListener('update-drawer-state', handleDrawerUpdate);
    
    return () => {
      document.removeEventListener('update-drawer-state', handleDrawerUpdate);
    };
  }, []);

  // Funkcja do zamykania Drawer
  const handleClose = () => {
    setIsDrawerOpen(false);
    onClose();
    // Powiadom DashboardLayout o zamknięciu
    document.dispatchEvent(new CustomEvent('drawer-close'));
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open: boolean) => !open && handleClose()}>
      <SheetContent side="left" className="p-0 w-[280px] bg-discord-background-tertiary border-discord-border" id="mobile-sidebar">
        <SheetHeader className="p-4 border-b border-discord-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-discord-text-normal font-semibold">Discord AI Support</SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} 
              className="text-discord-interactive-normal hover:text-discord-interactive-hover hover:bg-discord-background-primary">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-4">
          {/* Navigation Items */}
          <nav className="px-2 space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={handleClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  item.id === activeItemId
                    ? "bg-discord-blurple/10 text-discord-blurple"
                    : "text-discord-text-normal hover:bg-discord-background-primary hover:text-discord-interactive-hover"
                )}
                aria-current={item.id === activeItemId ? "page" : undefined}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-discord-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-discord-background-primary flex items-center justify-center">
              <span className="text-discord-interactive-normal text-sm font-medium">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-discord-text-normal">User</p>
              <p className="text-xs text-discord-text-muted">user@example.com</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 