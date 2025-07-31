import type { NavigationItem } from "@/constants/navigation";

export interface SidebarProps {
  className?: string;
}

export interface NavigationItemComponentProps {
  item: NavigationItem;
  isActive: boolean;
}

export interface SidebarContentProps {
  className?: string;
}
