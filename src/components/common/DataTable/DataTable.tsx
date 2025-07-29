"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

export interface DataTableColumn<TData = Record<string, unknown>> {
  key: keyof TData;
  title: string;
  render?: (value: TData[keyof TData], row: TData) => ReactNode;
  className?: string;
  sticky?: boolean;
}

export interface DataTableProps<TData = Record<string, unknown>> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  stickyFirstColumn?: boolean;
  className?: string;
  rowKey?: keyof TData | ((row: TData) => string);
}

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  stickyFirstColumn = false,
  className = "",
  rowKey = "id" as keyof TData,
}: DataTableProps<TData>) {
  const getRowKey = (row: TData, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    const keyValue = row[rowKey];
    return keyValue !== null && keyValue !== undefined ? String(keyValue) : `row-${index}`;
  };

  return (
    <motion.div
      className={`sticky-table-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={`${
                  column.sticky || (stickyFirstColumn && column === columns[0])
                    ? "sticky-left min-w-[140px] sm:min-w-[200px] bg-background"
                    : ""
                } ${column.className || ""}`}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={getRowKey(row, index)}>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={`${
                    column.sticky || (stickyFirstColumn && column === columns[0])
                      ? "sticky-left bg-background border-b"
                      : "border-b"
                  } ${column.className || ""}`}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key] !== null && row[column.key] !== undefined
                    ? String(row[column.key])
                    : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
} 