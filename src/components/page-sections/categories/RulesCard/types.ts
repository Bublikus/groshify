import type { Category } from "../types";

export interface RulesCardProps {
  displayCategories: Category[];
  totalRules: number;
  activeRules: number;
}

export interface RulesCardContainerProps {
  categories: Category[];
}
