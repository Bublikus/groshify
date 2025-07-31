"use client";

import { useMemo, useState } from "react";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";
import { documentParserService } from "@/parsers";
import {
  calculateCategorySummaries,
  calculateMonthlyData,
  calculateOverallSums,
  getCurrentMonthData,
  getCurrentSums,
} from "../helpers";
import { TransactionCategory, TransactionsTableState } from "../types";

export const useTransactionsTable = () => {
  const [state, setState] = useState<TransactionsTableState>({
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
      const categoryNames = TRANSACTION_CATEGORIES.map((cat) => cat.name);

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
      const initialCategories: Record<string, TransactionCategory> = {};

      // Add AI-categorized transactions
      categorizedTransactions.forEach((categorized: { id: string; category: string }) => {
        initialCategories[categorized.id] = categorized.category as TransactionCategory;
      });

      // Set final state with categorized data
      setState((prev) => ({
        ...prev,
        categories: initialCategories,
        isCategorizing: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isCategorizing: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
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
      selectedMonth: "all",
      categories: {},
      error: null,
    }));
  };

  const handleCategoryChange = (rowId: string, category: TransactionCategory) => {
    setState((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [rowId]: category,
      },
    }));
  };

  const monthlyData = useMemo(() => {
    return calculateMonthlyData(state.data, state.headers);
  }, [state.data, state.headers]);

  const overallSums = useMemo(() => {
    return calculateOverallSums(state.data, state.headers);
  }, [state.data, state.headers]);

  const currentMonthData = useMemo(() => {
    return getCurrentMonthData(state.data, monthlyData, state.selectedMonth);
  }, [state.data, monthlyData, state.selectedMonth]);

  const currentSums = useMemo(() => {
    return getCurrentSums(overallSums, monthlyData, state.selectedMonth);
  }, [overallSums, monthlyData, state.selectedMonth]);

  const categorySummaries = useMemo(() => {
    return calculateCategorySummaries(currentMonthData, state.headers, state.categories);
  }, [currentMonthData, state.headers, state.categories]);

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
  };
};
