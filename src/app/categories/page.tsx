"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  type Category,
  CategoryFiltersContainer,
  CategoryStatsContainer,
  CategoryTableContainer,
  SubcategoriesContainer,
} from "@/components/page-sections/categories";
import { Typography } from "@/components/ui/typography";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";

// Transform TRANSACTION_CATEGORIES to match Category interface
const categories: Category[] = TRANSACTION_CATEGORIES.map((cat, index) => ({
  id: index + 1,
  name: cat.name,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
  transactionCount: 0, // Will be calculated from subcategories
  totalAmount: 0, // Will be calculated from subcategories
  isActive: true,
  subcategories: cat.subcategories.map((subcat, subIndex) => ({
    id: subIndex + 1,
    name: subcat,
    transactionCount: 0,
    totalAmount: 0,
    isActive: true,
  })),
}));

export default function CategoriesPage() {
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
        <CategoryFiltersContainer />

        {/* Categories Table */}
        <CategoryTableContainer categories={categories} />

        {/* Subcategories */}
        <SubcategoriesContainer categories={categories} />
      </div>
    </ErrorBoundary>
  );
}
