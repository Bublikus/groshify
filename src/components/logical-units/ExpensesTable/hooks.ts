"use client";

import { useMemo, useState } from "react";
import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { documentParserService } from "@/lib/parsers";
import { CategorySummary, ExpenseCategory, ExpensesTableState, MonthData } from "./types";

export const useExpensesTable = () => {
  const [state, setState] = useState<ExpensesTableState>({
    data: [],
    headers: [],
    isLoading: false,
    isCategorizing: false,
    error: null,
    fileInfo: null,
    selectedFile: null,
    selectedMonth: "all",
    isFileInfoOpen: false,
    headerTitles: [],
    categories: {},
  });

  const handleFileUpload = async (file: File) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      fileInfo: null,
      selectedFile: file,
    }));

    try {
      // Check if file can be parsed
      if (!documentParserService.canParse(file)) {
        const supportedExtensions = documentParserService.getSupportedExtensions().join(", ");
        throw new Error(`Unsupported file type. Supported extensions: ${supportedExtensions}`);
      }

      // Parse the file
      const result = await documentParserService.parse(file);

      const headerTitles = Object.keys(result.data[0])
        .filter((key) => key !== "id")
        .map((key) => String(result.data[0][key] || ""));
      const dataRows = result.data.slice(1);

      // Prepare transactions for categorization (limit to first 10 to avoid timeout)
      const transactions = dataRows.slice(0, 10).map((row) => ({
        id: row.id,
        description: String(row[result.headers[3]] || ""), // Column 4 (0-indexed)
      }));

      // Get category names for categorization
      const categoryNames = EXPENSE_CATEGORIES.map((cat) => cat.name);

      // Set categorizing state
      setState((prev) => ({
        ...prev,
        data: dataRows,
        headers: result.headers,
        headerTitles,
        fileInfo: result.fileInfo,
        selectedMonth: "all", // Reset to show all data initially
        isLoading: false,
        isCategorizing: true,
      }));

      // Call the categorization API
      const categorizationResponse = await fetch("/api/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions,
          categories: categoryNames,
        }),
      });

      if (!categorizationResponse.ok) {
        throw new Error("Failed to categorize transactions");
      }

      const { categorizedTransactions } = await categorizationResponse.json();

      // Initialize categories with AI-determined values for first 10 transactions
      const initialCategories: Record<string, ExpenseCategory> = {};

      // Add AI-categorized transactions
      categorizedTransactions.forEach((categorized: { id: string; category: string }) => {
        initialCategories[categorized.id] = categorized.category as ExpenseCategory;
      });

      // Set default category for remaining transactions
      dataRows.slice(10).forEach((row) => {
        initialCategories[row.id] = "Інше";
      });

      setState((prev) => ({
        ...prev,
        categories: initialCategories,
        isCategorizing: false,
      }));
    } catch (error) {
      console.error("Error reading file:", error);
      setState((prev) => ({
        ...prev,
        error: `Error reading file: ${error instanceof Error ? error.message : "Unknown error"}`,
        isLoading: false,
      }));
    }
  };

  const handleFileRemove = () => {
    setState((prev) => ({
      ...prev,
      data: [],
      headers: [],
      headerTitles: [],
      fileInfo: null,
      selectedFile: null,
      categories: {},
      error: null,
    }));
  };

  const handleCategoryChange = (rowId: string, category: ExpenseCategory) => {
    setState((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [rowId]: category,
      },
    }));
  };

  // Group data by month
  const monthlyData = useMemo(() => {
    if (!state.data.length || !state.headers.length) return [];

    // Use first column for dates
    const dateColumnIndex = 0;

    // Group by month
    const monthGroups = new Map<string, MonthData>();

    state.data.forEach((row) => {
      const dateValue = row[state.headers[dateColumnIndex]];
      if (!dateValue) return;

      let date: Date;
      try {
        // Handle DD.MM.YYYY HH:MM:SS format
        if (typeof dateValue === "string") {
          // Check if it matches DD.MM.YYYY HH:MM:SS format
          const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
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

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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
      if (state.headers.length >= 5) {
        const column5Value = row[state.headers[4]];
        if (column5Value !== null && column5Value !== undefined && column5Value !== "") {
          const numValue =
            typeof column5Value === "number" ? column5Value : parseFloat(String(column5Value));
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
      const aMonthIndex = monthOrder.findIndex((month) => a.month.startsWith(month));
      const bMonthIndex = monthOrder.findIndex((month) => b.month.startsWith(month));
      return aMonthIndex - bMonthIndex;
    });
  }, [state.data, state.headers]);

  // Calculate overall sums for all data
  const overallSums = useMemo(() => {
    if (!state.data.length || !state.headers.length || state.headers.length < 5)
      return { positiveSum: 0, negativeSum: 0, totalSum: 0 };

    const column5Data = state.data.map((row) => {
      const column5Value = row[state.headers[4]];
      if (column5Value === null || column5Value === undefined || column5Value === "") {
        return 0;
      }
      const numValue =
        typeof column5Value === "number" ? column5Value : parseFloat(String(column5Value));
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
  }, [state.data, state.headers]);

  // Get current month data or all data
  const currentMonthData = useMemo(() => {
    if (state.selectedMonth === "all") {
      return state.data;
    }
    return monthlyData.find((month) => month.month === state.selectedMonth)?.data || [];
  }, [state.selectedMonth, monthlyData, state.data]);

  // Get current sums
  const currentSums = useMemo(() => {
    if (state.selectedMonth === "all") {
      return overallSums;
    }
    const monthData = monthlyData.find((month) => month.month === state.selectedMonth);
    return monthData
      ? {
          positiveSum: monthData.positiveSum,
          negativeSum: monthData.negativeSum,
          totalSum: monthData.totalSum,
        }
      : { positiveSum: 0, negativeSum: 0, totalSum: 0 };
  }, [state.selectedMonth, monthlyData, overallSums]);

  // Calculate category summaries
  const categorySummaries = useMemo(() => {
    const summaries: Record<string, CategorySummary> = {};

    currentMonthData.forEach((row) => {
      const category = state.categories[row.id] || "Other Expenses";
      let amount = 0;

      if (state.headers.length >= 5) {
        const column5Value = row[state.headers[4]];
        if (column5Value !== null && column5Value !== undefined && column5Value !== "") {
          amount =
            typeof column5Value === "number" ? column5Value : parseFloat(String(column5Value)) || 0;
        }
      }

      if (!summaries[category]) {
        summaries[category] = { count: 0, total: 0 };
      }
      summaries[category].count += 1;
      summaries[category].total += amount;
    });

    return Object.entries(summaries).sort(([, a], [, b]) => Math.abs(b.total) - Math.abs(a.total));
  }, [currentMonthData, state.categories, state.headers]);

  const supportedExtensions = documentParserService.getSupportedExtensions();

  return {
    state,
    setState,
    handleFileUpload,
    handleFileRemove,
    handleCategoryChange,
    monthlyData,
    currentMonthData,
    currentSums,
    categorySummaries,
    supportedExtensions,
    EXPENSE_CATEGORIES,
  };
};
