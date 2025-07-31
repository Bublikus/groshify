"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Edit3, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { VirtualizedList } from "@/components/common/VirtualizedList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { Category } from "../types";
import type { RulesCardProps } from "./types";

// Category item component for VirtualizedList
function CategoryItem({ category }: { category: Category }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 bg-background"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xl">{category.icon}</div>
          <Typography variant="small" className="font-medium">
            {category.name}
          </Typography>
          <Typography variant="muted" className="text-xs">
            ({category.subcategories.length} subcategories)
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleExpanded}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Subcategory
          </Button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="flex items-center justify-between p-2 bg-muted rounded ml-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${subcategory.isActive ? "bg-green-500" : "bg-gray-300"}`}
                />
                <Typography variant="small">{subcategory.name}</Typography>
                <Typography variant="muted" className="text-xs">
                  {subcategory.transactionCount} transactions
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function RulesCard({ categories, totalCategories, totalSubcategories }: RulesCardProps) {
  // Calculate dynamic item height based on category content and expansion state
  const calculateItemHeight = (index: number) => {
    const category = categories[index];
    if (!category) return 120; // Default height

    // Base height for category header and buttons
    let height = 80;

    // Add height for subcategories if expanded (approximately 40px per subcategory)
    // For now, we'll assume all categories are collapsed by default
    // In a real implementation, you'd track expansion state per category
    height += 20; // Space for potential expansion

    // Ensure minimum height
    return Math.max(height, 120);
  };

  // Render function for VirtualizedList
  const renderCategory = useCallback(
    (category: Category) => <CategoryItem category={category} />,
    []
  );

  const displayTotalCategories = totalCategories ?? categories.length;
  const displayTotalSubcategories =
    totalSubcategories ?? categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories & Subcategories</CardTitle>
        <CardDescription>
          Manage your transaction categories and their subcategories. ({displayTotalCategories}{" "}
          categories, {displayTotalSubcategories} subcategories)
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[600px] flex flex-col">
        <VirtualizedList<Category>
          data={categories}
          renderItem={renderCategory}
          itemSize={calculateItemHeight}
          adaptiveHeight={true}
          minHeight="200px"
          itemKey="id"
          className="space-y-4"
          overscan={3}
        />
      </CardContent>
    </Card>
  );
}
