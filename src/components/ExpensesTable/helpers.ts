import { EXPENSE_CATEGORIES } from "@/constants/categories";

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["name"];

// Function to guess category based on description
export const guessCategory = (description: string): ExpenseCategory => {
  if (!description) return "Інше";
  return "Інше";
};
