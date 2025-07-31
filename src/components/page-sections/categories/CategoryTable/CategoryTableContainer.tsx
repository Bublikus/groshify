"use client";

import type { Category } from "../types";
import { CategoryTable } from "./CategoryTable";
import { useCategoryTable } from "./hooks";

interface CategoryTableContainerProps {
  categories: Category[];
}

export function CategoryTableContainer({ categories }: CategoryTableContainerProps) {
  const { expandedCategories, toggleCategory } = useCategoryTable({ categories });

  return (
    <CategoryTable
      categories={categories}
      expandedCategories={expandedCategories}
      onToggleCategory={toggleCategory}
    />
  );
}
