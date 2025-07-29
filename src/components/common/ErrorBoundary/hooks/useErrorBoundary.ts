"use client";

import { useCallback, useState } from "react";
import { ErrorBoundaryState } from "../types";

export const useErrorBoundary = () => {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const resetError = useCallback(() => {
    setState({
      hasError: false,
      error: null,
    });
  }, []);

  const setError = useCallback((error: Error) => {
    setState({
      hasError: true,
      error,
    });
  }, []);

  return {
    hasError: state.hasError,
    error: state.error,
    resetError,
    setError,
  };
};
