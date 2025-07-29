/**
 * Type definitions for document parsing service
 */

export interface ParsedRow {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ParseResult {
  data: ParsedRow[];
  headers: string[];
  fileInfo: FileInfo;
}

export interface FileInfo {
  headers: string[];
  totalRows: number;
  sampleData: Record<string, string | number | boolean | null | undefined>[];
}

export interface ParserOptions {
  sheetIndex?: number;
  headerRow?: number;
  skipEmptyRows?: boolean;
  trimHeaders?: boolean;
}

export type CellValue = string | number | boolean | null | undefined;
export type RowData = CellValue[];

export interface DocumentParser {
  canParse(file: File): boolean;
  parse(file: File, options?: ParserOptions): Promise<ParseResult>;
  getSupportedExtensions(): string[];
}
