"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/utils/cn";
import styles from "./ErrorBoundary.module.css";
import { ErrorOverlayProps } from "./types";

export function ErrorOverlay({ error, onReset, className }: ErrorOverlayProps) {
  return (
    <div className={cn(styles.overlay, className)}>
      <Card className={styles.errorCard}>
        <CardContent className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <AlertTriangle className={styles.icon} />
          </div>

          <Typography variant="h3" className={styles.errorTitle}>
            Something went wrong
          </Typography>

          <Typography variant="muted" className={styles.errorMessage}>
            {error.message || "An unexpected error occurred"}
          </Typography>

          <div className={styles.errorDetails}>
            <Typography variant="code" className={styles.errorStack}>
              {error.stack?.split("\n").slice(0, 3).join("\n") || error.name}
            </Typography>
          </div>

          <Button onClick={onReset} className={styles.retryButton} variant="outline">
            <RefreshCw className={styles.retryIcon} />
            <span>Try Again</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
