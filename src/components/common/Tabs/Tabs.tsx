"use client";

import { motion } from "framer-motion";
import { Tabs as UITabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useCallback } from "react";

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
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94627 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
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
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6758 5.94673 11.3594 6.1356 11.1579L9.56501 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
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
