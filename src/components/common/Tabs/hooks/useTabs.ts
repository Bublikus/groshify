"use client";

import { useCallback, useRef } from "react";
import { TabsProps } from "../types";

export const useTabs = ({
  value,
  onValueChange,
  tabs,
}: Pick<TabsProps, "value" | "onValueChange" | "tabs">) => {
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

  return {
    tabsRef,
    canNavigateLeft,
    canNavigateRight,
    scrollLeft,
    scrollRight,
  };
};
