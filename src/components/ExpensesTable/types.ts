import { ParseResult } from "@/lib/parsers";
import { ExpenseCategory } from "./helpers";

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
  isLoading: boolean;
  error: string | null;
  fileInfo: ParseResult["fileInfo"] | null;
  selectedMonth: string;
  isFileInfoOpen: boolean;
  categories: Record<string, ExpenseCategory>;
} 