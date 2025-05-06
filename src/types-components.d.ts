// Type definitions for component imports in TypeScript
declare module "@/components/dashboard/Sidebar" {
  import { FC } from "react";
  import { NavItemType } from "@/components/dashboard/Sidebar";

  export interface SidebarProps {
    items: NavItemType[];
    activeItemId?: string;
    serverId?: string;
  }

  const Sidebar: FC<SidebarProps>;
  export default Sidebar;
}

declare module "@/components/dashboard/Topbar" {
  import { FC } from "react";

  export interface TopbarProps {
    title?: string;
    onToggle?: () => void;
    serverName?: string;
    serverIcon?: string;
    serverStatus?: "online" | "offline" | "maintenance" | "unknown";
    username?: string;
  }

  const Topbar: FC<TopbarProps>;
  export default Topbar;
}

declare module "@/components/dashboard/Drawer" {
  import { FC } from "react";
  import { NavItemType } from "@/components/dashboard/Sidebar";

  export interface DrawerProps {
    items: NavItemType[];
    activeItemId?: string;
    isOpen: boolean;
    onClose: () => void;
    serverId?: string;
  }

  const Drawer: FC<DrawerProps>;
  export default Drawer;
}

declare module "@/components/knowledge/DiscordKnowledgeList" {
  import { FC } from "react";
  import type { DocumentList } from "@/types";

  export interface KnowledgeListProps {
    serverId: string;
    initialDocuments?: DocumentList | null;
  }

  const DiscordKnowledgeList: FC<KnowledgeListProps>;
  export default DiscordKnowledgeList;
}

declare module "@/components/knowledge/KnowledgeView" {
  import { FC } from "react";
  import type { DocumentList } from "@/types";

  export interface KnowledgeViewProps {
    serverId: string;
    initialDocuments?: DocumentList | null;
  }

  const KnowledgeView: FC<KnowledgeViewProps>;
  export default KnowledgeView;
}

declare module "@/components/dashboard/BackLink" {
  import { FC } from "react";

  export interface BackLinkProps {
    href: string;
    label?: string;
  }

  const BackLink: FC<BackLinkProps>;
  export default BackLink;
}

declare module "@/components/ui/sonner" {
  import { FC } from "react";

  export interface ToasterProps {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
    toastOptions?: Record<string, unknown>;
    theme?: "light" | "dark" | "system";
  }

  export const Toaster: FC<ToasterProps>;
}
