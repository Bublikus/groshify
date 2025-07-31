import { ReactNode } from "react";

export interface VirtualizedListProps<TData = Record<string, unknown>> {
  data: TData[];
  renderItem: (item: TData, index: number) => ReactNode;
  itemHeight?: number;
  itemSize?: (index: number) => number;
  className?: string;
  height?: string | number;
  overscan?: number;
  itemKey?: keyof TData | ((item: TData, index: number) => string);
  emptyState?: ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
  adaptiveHeight?: boolean;
  minHeight?: string | number;
  maxHeight?: string | number;
}

export interface VirtualizedListState {
  isLoading: boolean;
  error: string | null;
}

export interface VirtualizedListActions {
  refresh: () => void;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
}
