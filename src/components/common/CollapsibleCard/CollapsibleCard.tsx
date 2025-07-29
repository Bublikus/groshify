"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReactNode } from "react";

interface CollapsibleCardProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

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
        <Card className={`py-0 gap-0 ${className}`}>
          <CardHeader className="p-0 block">
            <CollapsibleTrigger asChild>
              <motion.button className="w-full flex items-center justify-between text-left hover:bg-accent/50 rounded-md p-6 transition-colors cursor-pointer">
                <CardTitle>{title}</CardTitle>
                <motion.div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
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
                <CardContent className="py-6">
                  {children}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Collapsible>
    </motion.div>
  );
} 