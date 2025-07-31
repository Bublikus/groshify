"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_CONFIG } from "@/constants/app";
import { navigationItems, quickActions } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import styles from "./Sidebar.module.css";
import type { NavigationItemComponentProps, SidebarContentProps, SidebarProps } from "./types";

function NavigationItemComponent({ item, isActive }: NavigationItemComponentProps) {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(styles.navigationItem, isActive && styles.navigationItemActive)}
      >
        <Icon className={styles.navigationItemIcon} />
        <div className={styles.navigationItemContent}>
          <span className={styles.navigationItemTitle}>{item.title}</span>
          {item.description && (
            <span className={styles.navigationItemDescription}>{item.description}</span>
          )}
        </div>
      </Button>
    </Link>
  );
}

function SidebarContent({ className }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className={cn(styles.sidebarContent, className)}>
      {/* Header */}
      <div className={cn(styles.header, "border-b")}>
        <Link href="/" className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}>G</span>
          </div>
          <div className={styles.appInfo}>
            <h1 className={styles.appName}>{APP_CONFIG.name}</h1>
            <p className={styles.appDescription}>{APP_CONFIG.description}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className={styles.navigation}>
        <nav className={styles.navigationList}>
          <div className={cn(styles.navigationSection, "pb-2 border-b")}>
            <div className={styles.sectionTitle} role="heading" aria-level={2}>
              Main Navigation
            </div>
            {navigationItems.map((item) => (
              <NavigationItemComponent
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>

          <div className={cn(styles.navigationSection, "pb-2 border-b")}>
            <div className={styles.sectionTitle} role="heading" aria-level={2}>
              Quick Actions
            </div>
            {quickActions.map((item) => (
              <NavigationItemComponent
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn(styles.footer, "border-t")}>
        <div className={styles.footerText}>v{APP_CONFIG.version}</div>
      </div>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className={cn(styles.sidebar, className)}>
        {/* Desktop Sidebar */}
        <div className={cn(styles.desktopSidebar, "border-r")}>
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={styles.mobileMenuButton}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate through the main sections and quick actions of the application
            </SheetDescription>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content offset for desktop */}
        <div className={styles.mainContentOffset} />
      </div>
    </ErrorBoundary>
  );
}
