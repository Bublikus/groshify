"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  CategoryFiltersContainer,
  CategoryStatsContainer,
  CategoryTableContainer,
  SubcategoriesContainer,
} from "@/components/page-sections/categories";
import { Typography } from "@/components/ui/typography";
import { useCategoriesPage } from "@/hooks/page-hooks/categories";

export default function CategoriesPage() {
  const { categories, filteredCategories, filters, setFilters } = useCategoriesPage();

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">Categories</Typography>
            <Typography variant="muted">
              Define and manage your transaction categories and subcategories.
            </Typography>
          </div>
        </div>

        {/* Stats */}
        <CategoryStatsContainer categories={categories} />

        {/* Filters */}
        <CategoryFiltersContainer filters={filters} onFiltersChange={setFilters} />

        {/* Categories Table */}
        <CategoryTableContainer categories={filteredCategories} />

        {/* Subcategories */}
        <SubcategoriesContainer categories={filteredCategories} />
      </div>
    </ErrorBoundary>
  );
}
