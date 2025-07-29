"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { TabsList, TabsTrigger, Tabs as UITabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import styles from "./Tabs.module.css";
import { TabsProps } from "./types";

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
  const canNavigateRight = tabs.findIndex((tab) => tab.value === value) < tabs.length - 1;

  const scrollLeft = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      onValueChange(prevTab.value);

      // Scroll the previous tab into view
      if (tabsRef.current) {
        const tabElement = tabsRef.current.querySelector(`[data-value="${prevTab.value}"]`);
        if (tabElement instanceof HTMLElement) {
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
        const tabElement = tabsRef.current.querySelector(`[data-value="${nextTab.value}"]`);
        if (tabElement instanceof HTMLElement) {
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
      className={cn(styles.container, className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <UITabs value={value} onValueChange={onValueChange} className={styles.tabsContainer}>
        <div className={styles.navigationContainer}>
          {/* Left Arrow Button */}
          {showNavigationArrows && (
            <motion.button
              onClick={scrollLeft}
              disabled={!canNavigateLeft}
              className={cn(styles.navigationButton, styles.navigationButtonLeft)}
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
              className={cn(styles.navigationButton, styles.navigationButtonRight)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          )}

          {/* Scrollable Tabs Container */}
          <div
            ref={tabsRef}
            className={cn(
              styles.scrollableContainer,
              showNavigationArrows && styles.scrollableContainerWithArrows
            )}
          >
            <TabsList className={cn(styles.tabsList, tabsListClassName)}>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className={cn(styles.tabTrigger, tabTriggerClassName)}
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
