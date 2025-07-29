"use client";

import { Row, flexRender } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { TableVirtuoso } from "react-virtuoso";
import { HTMLAttributes, forwardRef } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import styles from "./DataTable.module.css";
import { useDataTable } from "./hooks";
import { ColumnMeta, DataTableProps } from "./types";

// Sorting indicator component
function SortingIndicator({ isSorted }: { isSorted: false | "asc" | "desc" }) {
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

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      style={{ tableLayout: "auto" }}
      {...props}
    />
  )
);
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
  function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
    // @ts-expect-error data-index is a valid attribute
    const index = props["data-index"];
    const row = rows[index];

    if (!row) return null;

    return (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} {...props}>
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

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  stickyFirstColumn = false,
  className = "",
  height = "400px",
}: DataTableProps<TData>) {
  const { table } = useDataTable({
    columns,
    data,
    stickyFirstColumn,
  });

  const { rows } = table.getRowModel();

  return (
    <ErrorBoundary>
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
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            <SortingIndicator isSorted={header.column.getIsSorted()} />
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
    </ErrorBoundary>
  );
}
