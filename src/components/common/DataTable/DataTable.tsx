"use client";

import {
  ColumnDef,
  Row,
  SortDirection,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { HTMLAttributes, forwardRef, useState, ReactNode } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import styles from "./DataTable.module.css";

interface ColumnMeta {
  sticky?: boolean;
  className?: string;
}

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    style={{ tableLayout: "auto" }}
    {...props}
  />
));
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
  function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
    // @ts-expect-error data-index is a valid attribute
    const index = props["data-index"];
    const row = rows[index];

    if (!row) return null;

    return (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        {...props}
      >
        {row.getVisibleCells().map((cell) => {
          const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
          return (
            <TableCell
              key={cell.id}
              data-slot="table-cell"
              className={cn(
                meta?.sticky && styles.stickyLeft,
                "bg-background border-b",
                meta?.className
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
  if (!isSorted) return null;
  return (
    <div className="ml-2">
      {
        {
          asc: "↑",
          desc: "↓",
        }[isSorted]
      }
    </div>
  );
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

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  stickyFirstColumn = false,
  className = "",
  height = "400px",
}: DataTableProps<TData>) {
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
    const isSticky =
      column.sticky || (stickyFirstColumn && column === columns[0]);

    return {
      id: safeKey,
      accessorFn: (row: TData) => row[column.key],
      header: column.title,
      cell: ({ row }) => {
        const value = row.original[column.key];
        if (column.render) {
          return column.render(value, row.original);
        }
        return value !== null && value !== undefined ? String(value) : "";
      },
      meta: {
        className: column.className,
        sticky: isSticky,
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

  const { rows } = table.getRowModel();

  return (
    <motion.div
      className={cn(styles.stickyTableContainer, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="rounded-md border overflow-hidden">
        <TableVirtuoso
          style={{ height }}
          totalCount={rows.length}
          components={{
            Table: TableComponent,
            TableRow: TableRowComponent(rows),
          }}
          fixedHeaderContent={() =>
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-card hover:bg-muted" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      data-slot="table-head"
                      className={cn(
                        meta?.sticky && styles.stickyLeft,
                        "bg-background",
                        meta?.className
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="flex items-center justify-between w-full"
                          {...{
                            style: header.column.getCanSort()
                              ? {
                                  cursor: "pointer",
                                  userSelect: "none",
                                }
                              : {},
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          <SortingIndicator
                            isSorted={header.column.getIsSorted()}
                          />
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))
          }
        />
      </div>
    </motion.div>
  );
}
