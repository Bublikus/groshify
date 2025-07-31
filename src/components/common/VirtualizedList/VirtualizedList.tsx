"use client";

import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { cn } from "@/utils/cn";
import styles from "./VirtualizedList.module.css";
import { VIRTUALIZED_LIST_CONSTANTS } from "./constants";
import { generateItemKey } from "./helpers";
import { useVirtualizedList } from "./hooks";
import { VirtualizedListProps } from "./types";

// Default empty state component
function DefaultEmptyState() {
  return (
    <div className={styles.emptyState}>
      <span>{VIRTUALIZED_LIST_CONSTANTS.DEFAULT_EMPTY_MESSAGE}</span>
    </div>
  );
}

// Default loading state component
function DefaultLoadingState() {
  return (
    <div className={styles.loadingState}>
      <span>{VIRTUALIZED_LIST_CONSTANTS.DEFAULT_LOADING_MESSAGE}</span>
    </div>
  );
}

// Error state component
function ErrorState({ error }: { error: string }) {
  return (
    <div className={styles.errorState}>
      <span>Error: {error}</span>
    </div>
  );
}

export function VirtualizedList<TData extends Record<string, unknown>>({
  data,
  renderItem,
  itemHeight,
  itemSize,
  className = "",
  height,
  overscan,
  itemKey,
  emptyState,
  loading = false,
  loadingState,
  adaptiveHeight,
  minHeight,
  maxHeight,
}: VirtualizedListProps<TData>) {
  const { virtuosoRef, state, validatedItemHeight, validatedOverscan, containerHeight } =
    useVirtualizedList({
      data,
      itemHeight,
      itemSize,
      height,
      overscan,
      loading,
      adaptiveHeight,
      minHeight,
      maxHeight,
    });

  // Show loading state if loading is true
  if (loading) {
    return (
      <ErrorBoundary>
        <motion.div
          className={cn(styles.virtualizedListContainer, className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ height: containerHeight || VIRTUALIZED_LIST_CONSTANTS.DEFAULT_HEIGHT }}
        >
          {loadingState || <DefaultLoadingState />}
        </motion.div>
      </ErrorBoundary>
    );
  }

  // Show error state if there's an error
  if (state.error) {
    return (
      <ErrorBoundary>
        <motion.div
          className={cn(styles.virtualizedListContainer, className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ height: containerHeight || VIRTUALIZED_LIST_CONSTANTS.DEFAULT_HEIGHT }}
        >
          <ErrorState error={state.error} />
        </motion.div>
      </ErrorBoundary>
    );
  }

  // Show empty state if no data
  if (data.length === 0) {
    return (
      <ErrorBoundary>
        <motion.div
          className={cn(styles.virtualizedListContainer, className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ height: containerHeight || VIRTUALIZED_LIST_CONSTANTS.DEFAULT_HEIGHT }}
        >
          {emptyState || <DefaultEmptyState />}
        </motion.div>
      </ErrorBoundary>
    );
  }

  // Determine if we should use fixed or variable item heights
  const useVariableHeights = !!itemSize;
  const virtuosoProps = useVariableHeights
    ? {
        itemSize: (el: HTMLElement) => {
          const index = parseInt(el.getAttribute("data-index") || "0");
          return itemSize ? itemSize(index) : validatedItemHeight;
        },
        overscan: validatedOverscan,
      }
    : {
        fixedItemHeight: validatedItemHeight,
        overscan: validatedOverscan,
      };

  return (
    <ErrorBoundary className="flex flex-col flex-1">
      <motion.div
        className={cn(styles.virtualizedListContainer, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ height: containerHeight || VIRTUALIZED_LIST_CONSTANTS.DEFAULT_HEIGHT }}
      >
        <Virtuoso
          ref={virtuosoRef}
          data={data}
          itemContent={(index: number, item: TData) => (
            <div
              data-slot="list-item"
              className="p-4"
              style={useVariableHeights ? undefined : { height: validatedItemHeight }}
            >
              {renderItem(item, index)}
            </div>
          )}
          {...virtuosoProps}
          components={{
            List: ({ children, ...props }) => (
              <div data-slot="list" {...props}>
                {children}
              </div>
            ),
          }}
          computeItemKey={(index: number) => generateItemKey(data[index], index, itemKey)}
        />
      </motion.div>
    </ErrorBoundary>
  );
}
