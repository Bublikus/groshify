"use client";

import { useState, useMemo, useRef } from "react";
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
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documentParserService, ParseResult, FileInfo } from "@/lib/parsers";
import { formatCurrency } from "@/lib/utils/number-format";

interface MonthData {
  month: string;
  year: number;
  data: ParseResult["data"];
  positiveSum: number;
  negativeSum: number;
  totalSum: number;
}

// Hardcoded expense categories
const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Housing",
  "Education",
  "Travel",
  "Insurance",
  "Investments",
  "Salary",
  "Freelance",
  "Other Income",
  "Other Expenses",
];

// Function to guess category based on description
const guessCategory = (description: string): string => {
  if (!description) return "Other Expenses";
  
  const desc = description.toLowerCase();
  
  // Food & Dining
  if (desc.includes("restaurant") || desc.includes("cafe") || desc.includes("food") || 
      desc.includes("grocery") || desc.includes("supermarket") || desc.includes("meal")) {
    return "Food & Dining";
  }
  
  // Transportation
  if (desc.includes("uber") || desc.includes("taxi") || desc.includes("bus") || 
      desc.includes("train") || desc.includes("gas") || desc.includes("fuel") ||
      desc.includes("parking") || desc.includes("metro")) {
    return "Transportation";
  }
  
  // Shopping
  if (desc.includes("amazon") || desc.includes("shop") || desc.includes("store") ||
      desc.includes("mall") || desc.includes("clothing") || desc.includes("shoes")) {
    return "Shopping";
  }
  
  // Entertainment
  if (desc.includes("movie") || desc.includes("cinema") || desc.includes("netflix") ||
      desc.includes("spotify") || desc.includes("game") || desc.includes("concert")) {
    return "Entertainment";
  }
  
  // Healthcare
  if (desc.includes("pharmacy") || desc.includes("doctor") || desc.includes("hospital") ||
      desc.includes("medical") || desc.includes("dental")) {
    return "Healthcare";
  }
  
  // Utilities
  if (desc.includes("electricity") || desc.includes("water") || desc.includes("internet") ||
      desc.includes("phone") || desc.includes("utility")) {
    return "Utilities";
  }
  
  // Housing
  if (desc.includes("rent") || desc.includes("mortgage") || desc.includes("home") ||
      desc.includes("apartment")) {
    return "Housing";
  }
  
  // Education
  if (desc.includes("school") || desc.includes("university") || desc.includes("course") ||
      desc.includes("book") || desc.includes("education")) {
    return "Education";
  }
  
  // Travel
  if (desc.includes("hotel") || desc.includes("flight") || desc.includes("airbnb") ||
      desc.includes("vacation") || desc.includes("trip")) {
    return "Travel";
  }
  
  // Insurance
  if (desc.includes("insurance") || desc.includes("premium")) {
    return "Insurance";
  }
  
  // Investments
  if (desc.includes("investment") || desc.includes("stock") || desc.includes("crypto") ||
      desc.includes("fund")) {
    return "Investments";
  }
  
  // Income categories
  if (desc.includes("salary") || desc.includes("payroll") || desc.includes("income")) {
    return "Salary";
  }
  
  if (desc.includes("freelance") || desc.includes("contract") || desc.includes("consulting")) {
    return "Freelance";
  }
  
  return "Other Expenses";
};

export function ExpensesTable() {
  const [data, setData] = useState<ParseResult["data"]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
  const [categories, setCategories] = useState<Record<string, string>>({});

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileInfo(null);

    try {
      // Check if file can be parsed
      if (!documentParserService.canParse(file)) {
        const supportedExtensions = documentParserService
          .getSupportedExtensions()
          .join(", ");
        throw new Error(
          `Unsupported file type. Supported extensions: ${supportedExtensions}`
        );
      }

      // Parse the file
      const result = await documentParserService.parse(file);

      setData(result.data);
      setHeaders(result.headers);
      setFileInfo(result.fileInfo);
      setSelectedMonth("all"); // Reset to show all data initially
      
      // Initialize categories with guessed values based on column 4 (description)
      const initialCategories: Record<string, string> = {};
      result.data.forEach((row) => {
        const description = row[result.headers[3]]; // Column 4 (0-indexed)
        if (description) {
          initialCategories[row.id] = guessCategory(String(description));
        }
      });
      setCategories(initialCategories);
    } catch (error) {
      console.error("Error reading file:", error);
      setError(
        `Error reading file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToMonth = (direction: "left" | "right") => {
    if (!tabsRef.current || monthlyData.length === 0) return;

    const currentIndex = monthlyData.findIndex(
      (month) => month.month === selectedMonth
    );
    if (currentIndex === -1) return;

    let targetIndex: number;
    if (direction === "left") {
      targetIndex = Math.max(0, currentIndex - 1);
    } else {
      targetIndex = Math.min(monthlyData.length - 1, currentIndex + 1);
    }

    const targetMonth = monthlyData[targetIndex];
    setSelectedMonth(targetMonth.month);

    // Scroll to center the target tab
    setTimeout(() => {
      if (tabsRef.current) {
        const tabsContainer = tabsRef.current;
        const tabElements = tabsContainer.querySelectorAll("[data-state]");
        const targetTab = tabElements[targetIndex + 1]; // +1 because "All" tab is first

        if (targetTab) {
          const containerWidth = tabsContainer.offsetWidth;
          const tabLeft = (targetTab as HTMLElement).offsetLeft;
          const tabWidth = (targetTab as HTMLElement).offsetWidth;
          const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

          tabsContainer.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  };

  const supportedExtensions = documentParserService.getSupportedExtensions();

  // Handle category change
  const handleCategoryChange = (rowId: string, category: string) => {
    setCategories(prev => ({
      ...prev,
      [rowId]: category
    }));
  };

  // Group data by month
  const monthlyData = useMemo(() => {
    if (!data.length || !headers.length) return [];

    // Use first column for dates
    const dateColumnIndex = 0;

    // Group by month
    const monthGroups = new Map<string, MonthData>();

    data.forEach((row) => {
      const dateValue = row[headers[dateColumnIndex]];
      if (!dateValue) return;

      let date: Date;
      try {
        // Handle DD.MM.YYYY HH:MM:SS format
        if (typeof dateValue === "string") {
          // Check if it matches DD.MM.YYYY HH:MM:SS format
          const dateRegex =
            /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
          const match = dateValue.match(dateRegex);

          if (match) {
            const [, day, month, year, hour, minute, second] = match;
            // Create date with month-1 because JavaScript months are 0-indexed
            date = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              parseInt(hour),
              parseInt(minute),
              parseInt(second)
            );
          } else {
            // Fallback to standard date parsing
            date = new Date(dateValue);
          }
        } else if (typeof dateValue === "number") {
          date = new Date(dateValue);
        } else {
          // For any other type, try to convert to string first
          date = new Date(String(dateValue));
        }

        if (isNaN(date.getTime())) return; // Invalid date
      } catch {
        return; // Date parsing failed
      }

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!monthGroups.has(monthKey)) {
        monthGroups.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          data: [],
          positiveSum: 0,
          negativeSum: 0,
          totalSum: 0,
        });
      }

      const monthData = monthGroups.get(monthKey)!;
      monthData.data.push(row);

      // Calculate column 5 sums
      if (headers.length >= 5) {
        const column5Value = row[headers[4]];
        if (
          column5Value !== null &&
          column5Value !== undefined &&
          column5Value !== ""
        ) {
          const numValue =
            typeof column5Value === "number"
              ? column5Value
              : parseFloat(String(column5Value));
          if (!isNaN(numValue)) {
            if (numValue > 0) {
              monthData.positiveSum += numValue;
            } else if (numValue < 0) {
              monthData.negativeSum += numValue;
            }
            monthData.totalSum += numValue;
          }
        }
      }
    });

    // Convert to array and sort by date (oldest first, left to right)
    return Array.from(monthGroups.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      // Extract month number from month name for comparison
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const aMonthIndex = monthOrder.findIndex((month) =>
        a.month.startsWith(month)
      );
      const bMonthIndex = monthOrder.findIndex((month) =>
        b.month.startsWith(month)
      );
      return aMonthIndex - bMonthIndex;
    });
  }, [data, headers]);

  // Calculate overall sums for all data
  const overallSums = useMemo(() => {
    if (!data.length || !headers.length || headers.length < 5)
      return { positiveSum: 0, negativeSum: 0, totalSum: 0 };

    const column5Data = data.map((row) => {
      const column5Value = row[headers[4]];
      if (
        column5Value === null ||
        column5Value === undefined ||
        column5Value === ""
      ) {
        return 0;
      }
      const numValue =
        typeof column5Value === "number"
          ? column5Value
          : parseFloat(String(column5Value));
      return isNaN(numValue) ? 0 : numValue;
    });

    const positiveSum = column5Data
      .filter((value) => value > 0)
      .reduce((sum, value) => sum + value, 0);
    const negativeSum = column5Data
      .filter((value) => value < 0)
      .reduce((sum, value) => sum + value, 0);
    const totalSum = positiveSum + negativeSum;

    return { positiveSum, negativeSum, totalSum };
  }, [data, headers]);

  // Get current month data or all data
  const currentMonthData = useMemo(() => {
    if (selectedMonth === "all") {
      return data;
    }
    return (
      monthlyData.find((month) => month.month === selectedMonth)?.data || []
    );
  }, [selectedMonth, monthlyData, data]);

  // Get current sums
  const currentSums = useMemo(() => {
    if (selectedMonth === "all") {
      return overallSums;
    }
    const monthData = monthlyData.find(
      (month) => month.month === selectedMonth
    );
    return monthData
      ? {
          positiveSum: monthData.positiveSum,
          negativeSum: monthData.negativeSum,
          totalSum: monthData.totalSum,
        }
      : { positiveSum: 0, negativeSum: 0, totalSum: 0 };
  }, [selectedMonth, monthlyData, overallSums]);

  // Calculate category summaries
  const categorySummaries = useMemo(() => {
    const summaries: Record<string, { count: number; total: number }> = {};
    
    currentMonthData.forEach((row) => {
      const category = categories[row.id] || "Other Expenses";
      let amount = 0;
      
      if (headers.length >= 5) {
        const column5Value = row[headers[4]];
        if (column5Value !== null && column5Value !== undefined && column5Value !== "") {
          amount = typeof column5Value === 'number' ? column5Value : parseFloat(String(column5Value)) || 0;
        }
      }
      
      if (!summaries[category]) {
        summaries[category] = { count: 0, total: 0 };
      }
      summaries[category].count += 1;
      summaries[category].total += amount;
    });
    
    return Object.entries(summaries)
      .sort(([, a], [, b]) => Math.abs(b.total) - Math.abs(a.total));
  }, [currentMonthData, categories, headers]);

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
                  disabled={isLoading}
                />
              </div>
              {isLoading && (
                <p className="text-sm text-muted-foreground">
                  Processing file...
                </p>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="text-sm text-muted-foreground">
                <p>
                  Upload any supported file to display its contents in a table
                  format.
                </p>
                <p>
                  All columns and data will be displayed exactly as they appear
                  in your file.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {fileInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Collapsible open={isFileInfoOpen} onOpenChange={setIsFileInfoOpen}>
              <Card className="py-0 gap-0">
                <CardHeader className="p-0 block">
                  <CollapsibleTrigger asChild>
                    <motion.button className="w-full flex items-center justify-between text-left hover:bg-accent/50 rounded-md p-6 transition-colors cursor-pointer">
                      <CardTitle>File Information</CardTitle>
                      <motion.div
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        animate={{ rotate: isFileInfoOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </motion.div>
                    </motion.button>
                  </CollapsibleTrigger>
                </CardHeader>
                <AnimatePresence>
                  {isFileInfoOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="py-6">
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium">
                              Columns ({fileInfo.headers.length}):
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {fileInfo.headers.join(", ")}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">
                              Total Rows: {fileInfo.totalRows}
                            </p>
                          </div>
                          {fileInfo.sampleData.length > 0 && (
                            <div>
                              <p className="font-medium">Sample Data:</p>
                              <div className="mt-2 space-y-2">
                                {fileInfo.sampleData.map((row, index) => (
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
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Collapsible>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data.length > 0 && (
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
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                      className="w-full"
                    >
                      <div className="relative flex items-center">
                        {/* Left Arrow Button */}
                        <motion.button
                          onClick={() => scrollToMonth("left")}
                          disabled={
                            selectedMonth === "all" ||
                            monthlyData.findIndex(
                              (month) => month.month === selectedMonth
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
                            selectedMonth === "all" ||
                            monthlyData.findIndex(
                              (month) => month.month === selectedMonth
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
                {headers.length >= 5 && (
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
                        {headers.map((header) => (
                          <TableHead key={header}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMonthData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="sticky-left bg-background border-b">
                            <Select
                              value={categories[row.id] || "Other Expenses"}
                              onValueChange={(value) => handleCategoryChange(row.id, value)}
                            >
                              <SelectTrigger className="w-full h-7 sm:h-8 text-xs px-2 sm:px-3">
                                <SelectValue className="truncate" />
                              </SelectTrigger>
                              <SelectContent>
                                {EXPENSE_CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          {headers.map((header) => (
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
