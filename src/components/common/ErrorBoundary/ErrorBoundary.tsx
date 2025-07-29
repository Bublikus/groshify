"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ErrorOverlay } from "./ErrorOverlay";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    // Call onReset callback if provided
    this.props.onReset?.();
  };

  render() {
    const { children, fallback, className } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      // If custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === "function") {
          return fallback(error, this.resetError);
        }
        return fallback;
      }

      // Default error overlay
      return <ErrorOverlay error={error} onReset={this.resetError} className={className} />;
    }

    return <div className={cn("error-boundary-container", className)}>{children}</div>;
  }
}
