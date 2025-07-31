"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  type Category,
  CategoryFilters,
  CategoryStats,
  CategoryTable,
  RulesCard,
} from "@/components/page-sections/categories";
import { Typography } from "@/components/ui/typography";
import { EXPENSE_CATEGORIES } from "@/constants/categories";

// Deterministic random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Transform EXPENSE_CATEGORIES into the format needed for the page
const transformCategories = (): Category[] => {
  return EXPENSE_CATEGORIES.map((cat, index) => {
    // Generate deterministic mock data for subcategories
    const subcategories = cat.subcategories.map((subcat, subIndex) => {
      const seed = index * 100 + subIndex;
      const transactionCount = Math.floor(seededRandom(seed) * 20) + 1;
      const totalAmount = -(seededRandom(seed + 1) * 1000 + 100);

      return {
        id: subIndex + 1,
        name: subcat,
        transactionCount,
        totalAmount,
        isActive: true,
      };
    });

    // Generate mock rules based on category name
    const rules = [
      {
        id: index * 2 + 1,
        condition: "contains",
        value: cat.name.toLowerCase().split(" ")[0],
        isActive: true,
      },
      {
        id: index * 2 + 2,
        condition: "contains",
        value: cat.subcategories[0]?.toLowerCase().split(" ")[0] || "other",
        isActive: true,
      },
    ];

    return {
      id: index + 1,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      transactionCount: subcategories.reduce((sum, sub) => sum + sub.transactionCount, 0),
      totalAmount: subcategories.reduce((sum, sub) => sum + sub.totalAmount, 0),
      isActive: true,
      subcategories,
      rules,
    };
  });
};

const categories = transformCategories();

export default function CategoriesPage() {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const totalRules = categories.reduce((sum, cat) => sum + cat.rules.length, 0);
  const totalTransactions = categories.reduce((sum, cat) => sum + cat.transactionCount, 0);
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">Categories</Typography>
            <Typography variant="muted">
              Define and manage your transaction categories and auto-categorization rules.
            </Typography>
          </div>
        </div>

        {/* Stats */}
        <CategoryStats
          totalCategories={totalCategories}
          activeCategories={activeCategories}
          totalRules={totalRules}
          totalTransactions={totalTransactions}
          totalSubcategories={totalSubcategories}
        />

        {/* Filters */}
        <CategoryFilters />

        {/* Categories Table */}
        <CategoryTable categories={categories} />

        {/* Rules Card */}
        <RulesCard categories={categories} />
      </div>
    </ErrorBoundary>
  );
}
