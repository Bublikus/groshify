import { ReactNode } from "react";

export interface UploadInputProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
  children?: ReactNode;
  className?: string;
  dragDropText?: string;
  dragDropActiveText?: string;
  supportedExtensionsText?: string;
  selectedFile?: File | null;
  onFileRemove?: () => void;
}

export interface DragDropState {
  isDragOver: boolean;
  isDragReject: boolean;
}
