"use client";

import { motion } from "framer-motion";
import { Tabs as UITabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: TabItem[];
  showNavigationArrows?: boolean;
  className?: string;
  tabsListClassName?: string;
  tabTriggerClassName?: string;
}

export function Tabs({
  value,
  onValueChange,
  tabs,
  showNavigationArrows = true,
  className = "",
  tabsListClassName = "",
  tabTriggerClassName = "",
}: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  const canNavigateLeft = tabs.findIndex((tab) => tab.value === value) > 0;
  const canNavigateRight =
    tabs.findIndex((tab) => tab.value === value) < tabs.length - 1;

  const scrollLeft = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      onValueChange(prevTab.value);

      // Scroll the previous tab into view
      if (tabsRef.current) {
        const tabElement = tabsRef.current.querySelector(
          `[data-value="${prevTab.value}"]`
        ) as HTMLElement;
        if (tabElement) {
          tabElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [tabs, value, onValueChange]);

  const scrollRight = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      onValueChange(nextTab.value);

      // Scroll the next tab into view
      if (tabsRef.current) {
        const tabElement = tabsRef.current.querySelector(
          `[data-value="${nextTab.value}"]`
        ) as HTMLElement;
        if (tabElement) {
          tabElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [tabs, value, onValueChange]);

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <UITabs value={value} onValueChange={onValueChange} className="w-full">
        <div className="relative flex items-center">
          {/* Left Arrow Button */}
          {showNavigationArrows && (
            <motion.button
              onClick={scrollLeft}
              disabled={!canNavigateLeft}
              className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          )}

          {/* Right Arrow Button */}
          {showNavigationArrows && (
            <motion.button
              onClick={scrollRight}
              disabled={!canNavigateRight}
              className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          )}

          {/* Scrollable Tabs Container */}
          <div
            ref={tabsRef}
            className={`flex-1 overflow-x-auto scrollbar-hide ${
              showNavigationArrows ? "mx-10" : ""
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <TabsList className={`flex w-max h-8 ${tabsListClassName}`}>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className={`shrink-0 px-6 ${tabTriggerClassName}`}
                  data-value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </UITabs>
    </motion.div>
  );
}
