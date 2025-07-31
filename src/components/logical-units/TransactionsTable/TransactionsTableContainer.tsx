"use client";

import { TRANSACTION_CATEGORIES } from "@/constants/categories";
import { TransactionsTable } from "./TransactionsTable";
import { useTransactionsTable } from "./hooks";

export function TransactionsTableContainer() {
  const transactionsTableData = useTransactionsTable();

  return (
    <TransactionsTable {...transactionsTableData} expenseCategories={TRANSACTION_CATEGORIES} />
  );
}
