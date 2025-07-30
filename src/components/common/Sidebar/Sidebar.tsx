"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_CONFIG } from "@/constants/app";
import { navigationItems, quickActions } from "@/constants/navigation";
import type { NavigationItem } from "@/constants/navigation";
import { cn } from "@/utils/cn";

interface SidebarProps {
  className?: string;
}

function NavigationItemComponent({ item, isActive }: { item: NavigationItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-auto py-3 px-4",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <div className="flex flex-col items-start">
          <span className="font-medium">{item.title}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">{item.description}</span>
          )}
        </div>
      </Button>
    </Link>
  );
}

function SidebarContent({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">{APP_CONFIG.name}</h1>
            <p className="text-xs text-muted-foreground">{APP_CONFIG.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Main Navigation
            </h3>
            {navigationItems.map((item) => (
              <NavigationItemComponent
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>

          <div className="space-y-1 pt-4 border-t">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Quick Actions
            </h3>
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
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">v{APP_CONFIG.version}</div>
      </div>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className={cn("flex", className)}>
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-background lg:border-r">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">G</span>
                </div>
                <h1 className="font-bold text-lg">{APP_CONFIG.name}</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content offset for desktop */}
        <div className="lg:pl-64 flex-1" />
      </div>
    </ErrorBoundary>
  );
}
