import { SortDirection } from "@tanstack/react-table";
import { ReactNode } from "react";

export interface ColumnMeta {
  sticky?: boolean;
  className?: string;
}

export interface SortingIndicatorProps {
  isSorted: SortDirection | false;
}

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
  height?: string;
}
