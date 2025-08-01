"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Edit3, MoreHorizontal, Plus, Settings } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { DataTableColumn } from "@/components/common/DataTable/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import type { Category } from "../types";
import type { CategoryTableProps } from "./types";

export function CategoryTable({
  categories,
  expandedCategories,
  onToggleCategory,
}: CategoryTableProps) {
  const columns: DataTableColumn<Category>[] = [
    {
      key: "name",
      title: "Category",
      render: (_, category) => (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCategory(category.id)}
              className="h-6 w-6 p-0"
            >
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="text-2xl">{category.icon}</div>
            <div>
              <Typography variant="small" className="font-medium">
                {category.name}
              </Typography>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {category.subcategories.length} subcategories
                </Badge>
                {!category.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Subcategories */}
          <AnimatePresence>
            {expandedCategories.has(category.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8 space-y-2 border-l-2 border-muted pl-4"
              >
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <Typography variant="small" className="text-muted-foreground">
                        {subcategory.name}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{subcategory.transactionCount} transactions</span>
                      <span
                        className={subcategory.totalAmount > 0 ? "text-green-600" : "text-red-600"}
                      >
                        {subcategory.totalAmount > 0 ? "+" : ""}$
                        {Math.abs(subcategory.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ),
    },
    {
      key: "transactionCount",
      title: "Transactions",
      render: (value) => (
        <Typography variant="small" className="font-medium">
          {String(value)}
        </Typography>
      ),
    },
    {
      key: "totalAmount",
      title: "Total Amount",
      render: (value) => {
        const amount = value as number;
        return (
          <Typography
            variant="small"
            className={`font-medium ${amount > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {amount > 0 ? "+" : ""}${Math.abs(amount).toFixed(2)}
          </Typography>
        );
      },
    },
    {
      key: "isActive",
      title: "Status",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Switch checked={Boolean(value)} />
          <Typography variant="small" className="text-muted-foreground">
            {Boolean(value) ? "Active" : "Inactive"}
          </Typography>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your transaction categories and subcategories</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={categories} />
      </CardContent>
    </Card>
  );
}
