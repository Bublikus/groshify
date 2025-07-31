import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { ParseResult } from "@/parsers";
import { ParsedRow } from "@/parsers/types";

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
  selectedFile: File | null;
  selectedMonth: string;
  isFileInfoOpen: boolean;
  categories: Record<string, ExpenseCategory>;
}

export interface ExpensesTableProps {
  state: ExpensesTableState;
  setState: React.Dispatch<React.SetStateAction<ExpensesTableState>>;
  handleFileUpload: (file: File) => Promise<void>;
  handleFileRemove: () => void;
  handleCategoryChange: (rowId: string, category: ExpenseCategory) => void;
  monthlyData: MonthData[];
  currentMonthData: ParsedRow[];
  currentSums: CurrentSums;
  categorySummaries: [string, CategorySummary][];
  supportedExtensions: string[];
  EXPENSE_CATEGORIES: Array<{
    name: string;
    description: string;
    icon: string;
    color: string;
    subcategories: string[];
  }>;
}
