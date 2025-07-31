"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/utils/cn";
import styles from "./CollapsibleCard.module.css";
import { ANIMATION_CONSTANTS, INITIAL_ANIMATION_VALUES } from "./constants";
import { CollapsibleCardProps } from "./types";

export function CollapsibleCard({
  title,
  isOpen,
  onOpenChange,
  children,
  className = "",
}: CollapsibleCardProps) {
  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: INITIAL_ANIMATION_VALUES.OPACITY, y: INITIAL_ANIMATION_VALUES.Y_ENTER }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: INITIAL_ANIMATION_VALUES.OPACITY, y: INITIAL_ANIMATION_VALUES.Y_EXIT }}
        transition={{ duration: ANIMATION_CONSTANTS.CARD_ENTER_DURATION }}
      >
        <Collapsible open={isOpen} onOpenChange={onOpenChange}>
          <Card className={cn(styles.card, className)}>
            <CardHeader className={styles.cardHeader}>
              <CollapsibleTrigger asChild>
                <motion.button className={cn(styles.triggerButton, "hover:bg-accent/50")}>
                  <CardTitle>{title}</CardTitle>
                  <motion.div
                    className={styles.triggerIcon}
                    animate={{
                      rotate: isOpen
                        ? INITIAL_ANIMATION_VALUES.ROTATION_OPEN
                        : INITIAL_ANIMATION_VALUES.ROTATION_CLOSED,
                    }}
                    transition={{ duration: ANIMATION_CONSTANTS.ICON_ROTATION_DURATION }}
                  >
                    <ChevronDown className="h-4 w-4 cursor-pointer" />
                  </motion.div>
                </motion.button>
              </CollapsibleTrigger>
            </CardHeader>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: INITIAL_ANIMATION_VALUES.OPACITY, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: INITIAL_ANIMATION_VALUES.OPACITY, height: 0 }}
                  transition={{
                    duration: ANIMATION_CONSTANTS.CONTENT_ANIMATION_DURATION,
                    ease: "easeInOut",
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <CardContent className={styles.content}>{children}</CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </Collapsible>
      </motion.div>
    </ErrorBoundary>
  );
}
