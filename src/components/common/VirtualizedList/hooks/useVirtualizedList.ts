"use client";

import { VirtuosoHandle } from "react-virtuoso";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  processHeightProp,
  shouldUseAdaptiveHeight,
  validateItemHeight,
  validateOverscan,
} from "../helpers";
import { VirtualizedListActions, VirtualizedListProps, VirtualizedListState } from "../types";

export const useVirtualizedList = <TData extends Record<string, unknown>>({
  data,
  itemHeight,
  itemSize,
  height,
  overscan,
  loading = false,
  adaptiveHeight,
  minHeight,
  maxHeight,
}: Pick<
  VirtualizedListProps<TData>,
  | "data"
  | "itemHeight"
  | "itemSize"
  | "height"
  | "overscan"
  | "loading"
  | "adaptiveHeight"
  | "minHeight"
  | "maxHeight"
>) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [error, setError] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>("");

  const validatedItemHeight = validateItemHeight(itemHeight);
  const validatedOverscan = validateOverscan(overscan);
  const useAdaptiveHeight = shouldUseAdaptiveHeight(data.length, adaptiveHeight);

  // Calculate adaptive height when data changes
  useEffect(() => {
    const newHeight = processHeightProp(
      height,
      useAdaptiveHeight,
      data.length,
      validatedItemHeight,
      minHeight,
      maxHeight
    );
    setContainerHeight(newHeight);
  }, [height, useAdaptiveHeight, data.length, validatedItemHeight, minHeight, maxHeight]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (virtuosoRef.current && index >= 0 && index < data.length) {
        virtuosoRef.current.scrollToIndex({
          index,
          behavior: "smooth",
        });
      }
    },
    [data.length]
  );

  const scrollToTop = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const refresh = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 0,
        behavior: "auto",
      });
    }
  }, []);

  const state: VirtualizedListState = {
    isLoading: loading,
    error,
  };

  const actions: VirtualizedListActions = {
    refresh,
    scrollToIndex,
    scrollToTop,
  };

  return {
    virtuosoRef,
    state,
    actions,
    validatedItemHeight,
    validatedOverscan,
    containerHeight,
    useAdaptiveHeight,
    itemSize,
    setError,
  };
};
