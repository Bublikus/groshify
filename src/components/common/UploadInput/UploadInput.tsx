"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import styles from "./UploadInput.module.css";
import { useUploadInput } from "./hooks";
import { UploadInputProps } from "./types";

export function UploadInput({
  onFileSelect,
  acceptedFileTypes = [],
  maxFileSize,
  disabled = false,
  isLoading = false,
  error = null,
  children,
  className = "",
  dragDropText = "Drag and drop your file here, or click to browse",
  dragDropActiveText = "Drop your file here",
  supportedExtensionsText,
  selectedFile = null,
  onFileRemove,
}: UploadInputProps) {
  const {
    dragState,
    fileInputRef,
    isDragActive,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    formatFileSize,
  } = useUploadInput({
    onFileSelect,
    acceptedFileTypes,
    maxFileSize,
    disabled: disabled || isLoading,
  });

  return (
    <ErrorBoundary>
      <motion.div
        className={cn(styles.container, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={cn(
            styles.uploadCard,
            isDragActive && styles.dragActive,
            dragState.isDragReject && styles.dragReject,
            disabled && styles.disabled
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className={styles.cardContent}>
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes.join(",")}
              onChange={handleInputChange}
              disabled={disabled || isLoading}
              className={styles.hiddenInput}
            />

            <motion.div
              className={cn(
                styles.uploadArea,
                isDragActive && styles.uploadAreaDragActive,
                dragState.isDragReject && styles.uploadAreaDragReject
              )}
              animate={{
                scale: isDragActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className={styles.loadingState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className={styles.spinner}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <Typography variant="muted">Processing file...</Typography>
                  </motion.div>
                ) : selectedFile ? (
                  <motion.div
                    key="file"
                    className={styles.fileState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.fileInfo}>
                      <div className={styles.fileIconContainer}>
                        <FileText className={styles.fileIcon} />
                      </div>
                      <div className={styles.fileDetails}>
                        <Typography variant="large" className={styles.fileName}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="muted" className={styles.fileSize}>
                          {formatFileSize(selectedFile.size)}
                        </Typography>
                      </div>
                      {onFileRemove && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFileRemove();
                          }}
                          disabled={disabled}
                        >
                          <X className={styles.removeIcon} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    className={styles.defaultState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className={styles.iconContainer}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isDragActive ? (
                        <FileText className={styles.icon} />
                      ) : (
                        <Upload className={styles.icon} />
                      )}
                    </motion.div>
                    <Typography variant="large" className={styles.title}>
                      {isDragActive ? dragDropActiveText : dragDropText}
                    </Typography>
                    {supportedExtensionsText && (
                      <Typography variant="muted" className={styles.supportedTypes}>
                        {supportedExtensionsText}
                      </Typography>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {error && (
              <motion.div
                className={styles.errorContainer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className={styles.errorIcon} />
                <Typography variant="muted" className={styles.errorText}>
                  {error}
                </Typography>
              </motion.div>
            )}

            {children && <div className={styles.children}>{children}</div>}
          </CardContent>
        </Card>
      </motion.div>
    </ErrorBoundary>
  );
}
