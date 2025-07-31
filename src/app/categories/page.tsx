"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  Hash,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { DataTableColumn } from "@/components/common/DataTable/types";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { EXPENSE_CATEGORIES } from "@/constants/categories";

// Types
interface CategoryRule {
  id: number;
  condition: string;
  value: string;
  isActive: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  transactionCount: number;
  totalAmount: number;
  isActive: boolean;
}

interface Category extends Record<string, unknown> {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  transactionCount: number;
  totalAmount: number;
  isActive: boolean;
  subcategories: Subcategory[];
  rules: CategoryRule[];
}

// Deterministic random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Transform EXPENSE_CATEGORIES into the format needed for the page
const transformCategories = (): Category[] => {
  return EXPENSE_CATEGORIES.map((cat, index) => {
    // Generate deterministic mock data for subcategories
    const subcategories: Subcategory[] = cat.subcategories.map((subcat, subIndex) => {
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
    const rules: CategoryRule[] = [
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

function CategoryStats() {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const totalRules = categories.reduce((sum, cat) => sum + cat.rules.length, 0);
  const totalTransactions = categories.reduce((sum, cat) => sum + cat.transactionCount, 0);
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);

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
          <Eye className="h-4 w-4 text-muted-foreground" />
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

function CategoryFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <CardDescription>Filter and search through your categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Active">Active Only</SelectItem>
              <SelectItem value="Inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryTable() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

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
              onClick={() => toggleCategory(category.id)}
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
                  {category.rules.length} rules
                </Badge>
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
      key: "rules",
      title: "Auto Rules",
      render: (value) => {
        const rules = value as CategoryRule[];
        return (
          <div className="space-y-1">
            {rules.slice(0, 2).map((rule: CategoryRule) => (
              <div key={rule.id} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-green-500" : "bg-gray-300"}`}
                />
                <Typography variant="small" className="text-muted-foreground">
                  {rule.condition} &quot;{rule.value}&quot;
                </Typography>
              </div>
            ))}
            {rules.length > 2 && (
              <Typography variant="small" className="text-muted-foreground">
                +{rules.length - 2} more rules
              </Typography>
            )}
          </div>
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
            <CardDescription>
              Manage your transaction categories and auto-categorization rules
            </CardDescription>
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

function RulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Categorization Rules</CardTitle>
        <CardDescription>Rules are applied in order. First matching rule wins.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.slice(0, 3).map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{category.icon}</div>
                  <Typography variant="small" className="font-medium">
                    {category.name}
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-2">
                {category.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <Typography variant="small">
                        {rule.condition} &quot;{rule.value}&quot;
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
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoriesPage() {
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
        <CategoryStats />

        {/* Filters */}
        <CategoryFilters />

        {/* Categories Table */}
        <CategoryTable />

        {/* Rules Card */}
        <RulesCard />
      </div>
    </ErrorBoundary>
  );
}
