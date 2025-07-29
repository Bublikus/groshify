"use client";

import { useCallback, useRef, useState } from "react";
import { DragDropState, UploadInputProps } from "./types";

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const useUploadInput = ({
  onFileSelect,
  acceptedFileTypes = [],
  maxFileSize,
  disabled = false,
}: Pick<UploadInputProps, "onFileSelect" | "acceptedFileTypes" | "maxFileSize" | "disabled">) => {
  const [dragState, setDragState] = useState<DragDropState>({
    isDragOver: false,
    isDragReject: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      // Check file type
      if (acceptedFileTypes.length > 0) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const isValidType = acceptedFileTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type.slice(1);
          }
          return file.type === type;
        });

        if (!isValidType) {
          return {
            isValid: false,
            error: `Invalid file type. Supported types: ${acceptedFileTypes.join(", ")}`,
          };
        }
      }

      // Check file size
      if (maxFileSize && file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
        return {
          isValid: false,
          error: `File too large. Maximum size: ${maxSizeMB}MB`,
        };
      }

      return { isValid: true };
    },
    [acceptedFileTypes, maxFileSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validation = validateFile(file);
      if (validation.isValid) {
        onFileSelect(file);
      } else {
        // You might want to show this error in a toast or other UI
        console.error(validation.error);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const validation = validateFile(file);
        setDragState({
          isDragOver: true,
          isDragReject: !validation.isValid,
        });
      }
    },
    [validateFile]
  );

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragState({ isDragOver: false, isDragReject: false });
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        handleFileSelect(file);
      }

      setDragState({ isDragOver: false, isDragReject: false });
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const isDragActive = dragState.isDragOver || dragState.isDragReject;

  return {
    dragState,
    fileInputRef,
    isDragActive,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    formatFileSize,
  };
};
