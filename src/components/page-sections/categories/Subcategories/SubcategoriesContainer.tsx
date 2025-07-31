"use client";

import { Subcategories } from "./Subcategories";
import type { SubcategoriesContainerProps } from "./types";

export function SubcategoriesContainer({ categories }: SubcategoriesContainerProps) {
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

  return (
    <Subcategories
      categories={categories}
      totalCategories={totalCategories}
      totalSubcategories={totalSubcategories}
    />
  );
}
