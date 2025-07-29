"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/number-format";
import { CollapsibleCard } from "@/components/common/CollapsibleCard";
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
              {state.error && <p className="text-sm text-destructive">{state.error}</p>}
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
                  <strong>Note:</strong> AI categorization is applied to the first 10 transactions only to ensure fast processing.
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
            onOpenChange={(open) => setState(prev => ({ ...prev, isFileInfoOpen: open }))}
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
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Tabs
                      value={state.selectedMonth}
                      onValueChange={(value) => setState(prev => ({ ...prev, selectedMonth: value }))}
                      className="w-full"
                    >
                      <div className="relative flex items-center">
                        {/* Left Arrow Button */}
                        <motion.button
                          onClick={() => scrollToMonth("left")}
                          disabled={
                            state.selectedMonth === "all" ||
                            monthlyData.findIndex(
                              (month) => month.month === state.selectedMonth
                            ) === 0
                          }
                          className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94627 8.84182 3.13514Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </motion.button>

                        {/* Right Arrow Button */}
                        <motion.button
                          onClick={() => scrollToMonth("right")}
                          disabled={
                            state.selectedMonth === "all" ||
                            monthlyData.findIndex(
                              (month) => month.month === state.selectedMonth
                            ) ===
                              monthlyData.length - 1
                          }
                          className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6758 5.94673 11.3594 6.1356 11.1579L9.56501 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </motion.button>

                        {/* Scrollable Tabs Container */}
                        <div
                          ref={tabsRef}
                          className="flex-1 overflow-x-auto scrollbar-hide mx-10"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          <TabsList className="flex w-max h-8">
                            <TabsTrigger value="all" className="shrink-0 px-6">
                              All
                            </TabsTrigger>
                            {monthlyData.map((monthData) => (
                              <TabsTrigger
                                key={monthData.month}
                                value={monthData.month}
                                className="shrink-0 px-6"
                              >
                                {monthData.month}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>
                      </div>
                    </Tabs>
                  </motion.div>
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
                            {summary.count} {summary.count === 1 ? 'item' : 'items'}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="sticky-table-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky-left min-w-[140px] sm:min-w-[200px] bg-background">
                          Category
                        </TableHead>
                        {state.headerTitles.map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMonthData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="sticky-left bg-background border-b">
                            <Select
                              value={state.categories[row.id] || "Other Expenses"}
                              onValueChange={(value) => handleCategoryChange(row.id, value as ExpenseCategory)}
                            >
                              <SelectTrigger className="w-full h-7 sm:h-8 text-xs px-2 sm:px-3">
                                <SelectValue className="truncate" />
                              </SelectTrigger>
                              <SelectContent>
                                {EXPENSE_CATEGORIES.map((category) => (
                                  <SelectItem key={category.name} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {state.headers.map((header) => (
                            <TableCell key={header} className="border-b">
                              {row[header] !== null && row[header] !== undefined
                                ? String(row[header])
                                : ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 