"use client";

import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTableProps } from "../types";

export const useDataTable = <TData extends Record<string, unknown>>({
  columns,
  data,
  stickyFirstColumn = false,
}: Pick<DataTableProps<TData>, "columns" | "data" | "stickyFirstColumn">) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Create a mapping from original keys to safe keys for TanStack Table
  const keyMapping = new Map<string, string>();
  columns.forEach((column, index) => {
    const safeKey = `col_${index}`;
    keyMapping.set(String(column.key), safeKey);
  });

  // Convert our column format to TanStack Table format
  const tableColumns: ColumnDef<TData, unknown>[] = columns.map((column, index) => {
    const safeKey = `col_${index}`;
    const isSticky = column.sticky || (stickyFirstColumn && column === columns[0]);

    return {
      id: safeKey,
      accessorFn: (row: TData) => row[column.key],
      header: column.title,
      cell: ({ row }: { row: { original: TData } }) => {
        const value = row.original[column.key];
        return column.render ? column.render(value, row.original) : String(value || "");
      },
      meta: {
        sticky: isSticky,
        className: column.className,
      },
    };
  });

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table,
    sorting,
    setSorting,
    keyMapping,
  };
};
