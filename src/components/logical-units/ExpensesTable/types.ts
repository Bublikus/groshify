import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { ParseResult } from "@/lib/parsers";

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["name"];

export interface MonthData {
  month: string;
  year: number;
  data: ParseResult["data"];
  positiveSum: number;
  negativeSum: number;
  totalSum: number;
}

export interface CategorySummary {
  count: number;
  total: number;
}

export interface CurrentSums {
  positiveSum: number;
  negativeSum: number;
  totalSum: number;
}

export interface ExpensesTableState {
  data: ParseResult["data"];
  headers: string[];
  headerTitles: string[];
  isLoading: boolean;
  isCategorizing: boolean;
  error: string | null;
  fileInfo: ParseResult["fileInfo"] | null;
  selectedMonth: string;
  isFileInfoOpen: boolean;
  categories: Record<string, ExpenseCategory>;
}
