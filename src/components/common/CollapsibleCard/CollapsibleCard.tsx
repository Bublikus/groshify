"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import styles from "./CollapsibleCard.module.css";
import { CollapsibleCardProps } from "./types";

export function CollapsibleCard({
  title,
  isOpen,
  onOpenChange,
  children,
  className = "",
}: CollapsibleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <Card className={cn(styles.card, className)}>
          <CardHeader className={styles.cardHeader}>
            <CollapsibleTrigger asChild>
              <motion.button className={cn(styles.triggerButton, "hover:bg-accent/50")}>
                <CardTitle>{title}</CardTitle>
                <motion.div
                  className={styles.triggerIcon}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4 cursor-pointer" />
                </motion.div>
              </motion.button>
            </CollapsibleTrigger>
          </CardHeader>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <CardContent className={styles.content}>{children}</CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Collapsible>
    </motion.div>
  );
}
