"use client";

import { Hash, Settings, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface CategoryStatsProps {
  totalCategories: number;
  activeCategories: number;
  totalRules: number;
  totalTransactions: number;
  totalSubcategories: number;
}

export function CategoryStats({
  totalCategories,
  activeCategories,
  totalRules,
  totalTransactions,
  totalSubcategories,
}: CategoryStatsProps) {
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
          <CardTitle className="text-sm font-medium">Auto Rules</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {totalRules}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Categorization rules
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
          <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            94%
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Auto-categorization accuracy
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
