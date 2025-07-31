import { useCallback, useState } from "react";
import type { Category } from "../../types";
import {
  collapseAllCategories,
  expandAllCategories,
  isCategoryExpanded,
  toggleCategoryExpanded,
} from "../helpers";

interface UseCategoryTableProps {
  categories: Category[];
}

interface UseCategoryTableReturn {
  expandedCategories: Set<number>;
  toggleCategory: (categoryId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (categoryId: number) => boolean;
}

export function useCategoryTable({ categories }: UseCategoryTableProps): UseCategoryTableReturn {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = useCallback((categoryId: number) => {
    setExpandedCategories((prev) => toggleCategoryExpanded(prev, categoryId));
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(expandAllCategories(categories));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedCategories(collapseAllCategories());
  }, []);

  const isExpanded = useCallback(
    (categoryId: number) => isCategoryExpanded(expandedCategories, categoryId),
    [expandedCategories]
  );

  return {
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    isExpanded,
  };
}
