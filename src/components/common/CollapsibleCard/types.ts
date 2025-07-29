import { ReactNode } from "react";

export interface CollapsibleCardProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
} 