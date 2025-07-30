import { BarChart3, CreditCard, FileText, LucideIcon, Tags, Upload, User } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Overview of your finances",
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    description: "Manage transactions",
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Tags,
    description: "Manage categories",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Financial analytics",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Settings and preferences",
  },
];

export const quickActions: NavigationItem[] = [
  {
    title: "Upload Data",
    href: "/upload",
    icon: Upload,
    description: "Upload new transaction files",
  },
];
