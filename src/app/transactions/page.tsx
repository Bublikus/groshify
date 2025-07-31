"use client";

import { Download, Edit3, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ExpensesTableContainer } from "@/components/logical-units/ExpensesTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";

const categories = [
  "All Categories",
  "Income",
  "Food",
  "Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
];

const dateRanges = [
  "All Time",
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
];

function TransactionFilters() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDateRange, setSelectedDateRange] = useState("This Month");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
        <CardDescription>Filter and search through your transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function BulkActions() {
  const [selectedCount] = useState(0);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="select-all" />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>
            </div>
            {selectedCount > 0 && <Badge variant="secondary">{selectedCount} selected</Badge>}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={selectedCount === 0}>
              <Edit3 className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" disabled={selectedCount === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionTable() {
  return <ExpensesTableContainer />;
}

export default function TransactionsPage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">Transactions</Typography>
            <Typography variant="muted">
              View and manage all your financial transactions.
            </Typography>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilters />

        {/* Bulk Actions */}
        <BulkActions />

        {/* Transactions Table */}
        <TransactionTable />
      </div>
    </ErrorBoundary>
  );
}
