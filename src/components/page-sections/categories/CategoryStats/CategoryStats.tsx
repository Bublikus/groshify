"use client";

import { Hash, Settings, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { CategoryStatsProps } from "./types";

export function CategoryStats({ stats }: CategoryStatsProps) {
  const {
    totalCategories,
    activeCategories,
    totalSubcategories,
    activeSubcategories,
    totalTransactions,
    effectiveness,
  } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {totalCategories}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {activeCategories} active, {totalSubcategories} subcategories
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {totalSubcategories}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {activeSubcategories} active subcategories
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {totalTransactions}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Categorized transactions
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Effectiveness</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {effectiveness}%
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Active subcategories rate
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
