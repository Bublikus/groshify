"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/number-format";
import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import { DataTable } from "@/components/common/DataTable";
import { Tabs } from "@/components/common/Tabs";
import { ParsedRow } from "@/lib/parsers/types";
import { useExpensesTable } from "./hooks";
import { ExpenseCategory } from "./types";

export function ExpensesTable() {
  const {
    state,
    setState,
    tabsRef,
    handleFileUpload,
    handleCategoryChange,
    scrollToMonth,
    monthlyData,
    currentMonthData,
    currentSums,
    categorySummaries,
    supportedExtensions,
    EXPENSE_CATEGORIES,
  } = useExpensesTable();

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload Data File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">
                  Upload File ({supportedExtensions.join(", ")})
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept={supportedExtensions.join(",")}
                  onChange={handleFileUpload}
                  disabled={state.isLoading || state.isCategorizing}
                />
              </div>
              {state.isLoading && (
                <p className="text-sm text-muted-foreground">
                  Processing file...
                </p>
              )}
              {state.isCategorizing && (
                <p className="text-sm text-muted-foreground">
                  🤖 AI is categorizing the first 10 transactions...
                </p>
              )}
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <div className="text-sm text-muted-foreground">
                <p>
                  Upload any supported file to display its contents in a table
                  format.
                </p>
                <p>
                  All columns and data will be displayed exactly as they appear
                  in your file.
                </p>
                <p>
                  <strong>Note:</strong> AI categorization is applied to the
                  first 10 transactions only to ensure fast processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {state.fileInfo && (
          <CollapsibleCard
            title="File Information"
            isOpen={state.isFileInfoOpen}
            onOpenChange={(open) =>
              setState((prev) => ({ ...prev, isFileInfoOpen: open }))
            }
          >
            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  Columns ({state.fileInfo.headers.length}):
                </p>
                <p className="text-sm text-muted-foreground">
                  {state.fileInfo.headers.join(", ")}
                </p>
              </div>
              <div>
                <p className="font-medium">
                  Total Rows: {state.fileInfo.totalRows}
                </p>
              </div>
              {state.fileInfo.sampleData.length > 0 && (
                <div>
                  <p className="font-medium">Sample Data:</p>
                  <div className="mt-2 space-y-2">
                    {state.fileInfo.sampleData.map((row, index) => (
                      <motion.div
                        key={index}
                        className="text-sm bg-muted p-2 rounded"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(row, null, 2)}
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleCard>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Data Table ({currentMonthData.length} rows)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Month Tabs */}
                {monthlyData.length > 0 && (
                  <Tabs
                    value={state.selectedMonth}
                    onValueChange={(value) =>
                      setState((prev) => ({ ...prev, selectedMonth: value }))
                    }
                    tabs={[
                      { value: "all", label: "All" },
                      ...monthlyData.map((monthData) => ({
                        value: monthData.month,
                        label: monthData.month,
                      })),
                    ]}
                  />
                )}

                {/* Summary Row */}
                {state.headers.length >= 5 && (
                  <motion.div
                    className="mb-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-3 bg-background/50 rounded-lg border flex flex-col justify-between"
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Column 5 Positive Sum
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(currentSums.positiveSum, {
                            showPositiveSign: true,
                          })}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-3 bg-background/50 rounded-lg border flex flex-col justify-between"
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Column 5 Negative Sum
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(currentSums.negativeSum)}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-3 bg-background/50 rounded-lg border flex flex-col justify-between"
                      >
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Column 5 Total
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            currentSums.totalSum >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(currentSums.totalSum, {
                            showPositiveSign: currentSums.totalSum >= 0,
                          })}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Category Summary */}
                {categorySummaries.length > 0 && (
                  <motion.div
                    className="mb-4 p-4 bg-muted/50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Category Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categorySummaries.map(([category, summary], index) => (
                        <motion.div
                          key={category}
                          className="text-center p-3 bg-background rounded-lg border shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                        >
                          <p className="text-sm font-medium text-muted-foreground truncate mb-1">
                            {category}
                          </p>
                          <p className="text-base font-bold mb-1">
                            {formatCurrency(summary.total, {
                              showPositiveSign: summary.total >= 0,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {summary.count}{" "}
                            {summary.count === 1 ? "item" : "items"}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <DataTable<ParsedRow>
                  columns={[
                    {
                      key: "category" as keyof ParsedRow,
                      title: "Category",
                      sticky: true,
                      render: (_, row) => (
                        <Select
                          value={state.categories[row.id] || "Other Expenses"}
                          onValueChange={(value) =>
                            handleCategoryChange(
                              row.id,
                              value as ExpenseCategory
                            )
                          }
                        >
                          <SelectTrigger className="w-full h-7 sm:h-8 text-xs px-2 sm:px-3">
                            <SelectValue className="truncate" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPENSE_CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.name}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ),
                    },
                    ...state.headers.map((header) => ({
                      key: header as keyof ParsedRow,
                      title:
                        state.headerTitles[state.headers.indexOf(header)] ||
                        header,
                    })),
                  ]}
                  data={currentMonthData}
                  stickyFirstColumn={true}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
