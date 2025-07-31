import { useCallback, useState } from "react";
import type { Category } from "../../types";

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
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allCategoryIds = categories.map((cat) => cat.id);
    setExpandedCategories(new Set(allCategoryIds));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const isExpanded = useCallback(
    (categoryId: number) => expandedCategories.has(categoryId),
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
