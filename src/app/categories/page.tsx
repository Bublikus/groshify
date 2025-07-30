"use client";

import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
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

// Types
interface CategoryRule {
  id: number;
  condition: string;
  value: string;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  color: string;
  transactionCount: number;
  totalAmount: number;
  isActive: boolean;
  rules: CategoryRule[];
  [key: string]: unknown; // Add index signature
}

interface TableRow {
  column: {
    toggleSorting: (ascending: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}

interface TableCell {
  row: {
    original: Category;
    getValue: (key: string) => unknown;
  };
}

// Mock data - in real app this would come from API
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Food",
    color: "#FF6B6B",
    transactionCount: 45,
    totalAmount: -1250.5,
    isActive: true,
    rules: [
      { id: 1, condition: "contains", value: "grocery", isActive: true },
      { id: 2, condition: "contains", value: "supermarket", isActive: true },
    ],
  },
  {
    id: 2,
    name: "Dining",
    color: "#4ECDC4",
    transactionCount: 23,
    totalAmount: -890.3,
    isActive: true,
    rules: [
      { id: 3, condition: "contains", value: "restaurant", isActive: true },
      { id: 4, condition: "contains", value: "cafe", isActive: true },
    ],
  },
  {
    id: 3,
    name: "Transportation",
    color: "#45B7D1",
    transactionCount: 18,
    totalAmount: -450.2,
    isActive: true,
    rules: [
      { id: 5, condition: "contains", value: "gas", isActive: true },
      { id: 6, condition: "contains", value: "uber", isActive: true },
    ],
  },
  {
    id: 4,
    name: "Entertainment",
    color: "#96CEB4",
    transactionCount: 12,
    totalAmount: -320.75,
    isActive: true,
    rules: [
      { id: 7, condition: "contains", value: "netflix", isActive: true },
      { id: 8, condition: "contains", value: "spotify", isActive: true },
    ],
  },
  {
    id: 5,
    name: "Shopping",
    color: "#FFEAA7",
    transactionCount: 31,
    totalAmount: -2100.45,
    isActive: true,
    rules: [
      { id: 9, condition: "contains", value: "amazon", isActive: true },
      { id: 10, condition: "contains", value: "walmart", isActive: true },
    ],
  },
  {
    id: 6,
    name: "Utilities",
    color: "#DDA0DD",
    transactionCount: 8,
    totalAmount: -650.8,
    isActive: true,
    rules: [
      { id: 11, condition: "contains", value: "electricity", isActive: true },
      { id: 12, condition: "contains", value: "water", isActive: true },
    ],
  },
  {
    id: 7,
    name: "Income",
    color: "#98D8C8",
    transactionCount: 4,
    totalAmount: 26000.0,
    isActive: true,
    rules: [
      { id: 13, condition: "contains", value: "salary", isActive: true },
      { id: 14, condition: "contains", value: "deposit", isActive: true },
    ],
  },
];

function CategoryStats() {
  const totalCategories = mockCategories.length;
  const activeCategories = mockCategories.filter((cat) => cat.isActive).length;
  const totalRules = mockCategories.reduce((sum, cat) => sum + cat.rules.length, 0);
  const totalTransactions = mockCategories.reduce((sum, cat) => sum + cat.transactionCount, 0);

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
            {activeCategories} active
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
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }: TableRow) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 flex items-center gap-1"
        >
          <Tag className="h-4 w-4" />
          Category
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: TableCell) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            <div>
              <Typography variant="small" className="font-medium">
                {category.name}
              </Typography>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {category.rules.length} rules
                </Badge>
                {!category.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "transactionCount",
      header: ({ column }: TableRow) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 flex items-center gap-1"
        >
          <Hash className="h-4 w-4" />
          Transactions
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: TableCell) => (
        <Typography variant="small" className="font-medium">
          {String(row.getValue("transactionCount"))}
        </Typography>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }: TableRow) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 flex items-center gap-1"
        >
          <Hash className="h-4 w-4" />
          Total Amount
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: TableCell) => {
        const amount = row.getValue("totalAmount") as number;
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
      accessorKey: "rules",
      header: "Auto Rules",
      cell: ({ row }: TableCell) => {
        const rules = row.getValue("rules") as CategoryRule[];
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: TableCell) => (
        <div className="flex items-center gap-2">
          <Switch checked={Boolean(row.getValue("isActive"))} />
          <Typography variant="small" className="text-muted-foreground">
            {Boolean(row.getValue("isActive")) ? "Active" : "Inactive"}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
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
      enableSorting: false,
      enableHiding: false,
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
        <DataTable columns={columns} data={mockCategories} searchKey="name" />
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
          {mockCategories.slice(0, 3).map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
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
