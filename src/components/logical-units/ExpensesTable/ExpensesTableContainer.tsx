"use client";

import { ExpensesTable } from "./ExpensesTable";
import { useExpensesTable } from "./hooks";

export function ExpensesTableContainer() {
  const expensesTableData = useExpensesTable();

  return <ExpensesTable {...expensesTableData} />;
}
