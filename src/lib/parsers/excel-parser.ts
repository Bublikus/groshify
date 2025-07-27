import * as XLSX from "xlsx";
import { DocumentParser, ParseResult, ParserOptions, ParsedRow, FileInfo, RowData } from "./types";

export class ExcelParser implements DocumentParser {
  getSupportedExtensions(): string[] {
    return [".xlsx", ".xls"];
  }

  canParse(file: File): boolean {
    const extension = this.getFileExtension(file.name);
    return this.getSupportedExtensions().includes(extension.toLowerCase());
  }

  async parse(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    const {
      sheetIndex = 0,
      headerRow = 0,
      skipEmptyRows = true,
      trimHeaders = true
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("No data read from file"));
            return;
          }

          const workbook = this.readWorkbook(data, file.name);
          const worksheet = this.getWorksheet(workbook, sheetIndex);
          const jsonData = this.convertToJson(worksheet);
          
          if (!jsonData || jsonData.length < 2) {
            reject(new Error("File appears to be empty or has no data rows"));
            return;
          }

          const headers = this.extractHeaders(jsonData[headerRow] as string[], trimHeaders);
          const dataRows = jsonData.slice(headerRow + 1) as RowData[];
          
          const fileInfo = this.createFileInfo(headers, dataRows);
          const parsedData = this.parseRows(dataRows, headers, skipEmptyRows);

          resolve({
            data: parsedData,
            headers,
            fileInfo
          });
        } catch (error) {
          // Provide more specific error messages
          const errorMessage = this.getErrorMessage(error, file.name);
          reject(new Error(errorMessage));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  private readWorkbook(data: string | ArrayBuffer, filename: string): XLSX.WorkBook {
    try {
      if (typeof data === 'string') {
        return XLSX.read(data, { type: 'string' });
      } else {
        return XLSX.read(new Uint8Array(data), { 
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false,
          // Add more lenient options to handle problematic files
          WTF: false,
          bookDeps: false,
          bookFiles: false,
          bookVBA: false,
          bookSheets: false,
          bookProps: false
        });
      }
    } catch (error) {
      // Try fallback parsing with more lenient options
      if (typeof data !== 'string') {
        try {
          console.warn(`Primary parsing failed for "${filename}", trying fallback method...`);
          return XLSX.read(new Uint8Array(data), { 
            type: 'array',
            cellDates: false,
            cellNF: false,
            cellText: false,
            WTF: false,
            bookDeps: false,
            bookFiles: false,
            bookVBA: false,
            bookSheets: false,
            bookProps: false
          });
        } catch (fallbackError) {
          // If fallback also fails, provide specific error message
          const errorMessage = this.getErrorMessage(error, filename);
          throw new Error(errorMessage);
        }
      }
      
      // Handle specific xlsx library errors
      if (error instanceof Error) {
        if (error.message.includes("Bad uncompressed size")) {
          throw new Error(`Excel file appears to be corrupted or in an unsupported format. Please try saving the file as a new .xlsx file.`);
        }
        if (error.message.includes("Invalid file")) {
          throw new Error(`The file "${filename}" is not a valid Excel file. Please check the file format.`);
        }
        if (error.message.includes("password")) {
          throw new Error(`The Excel file "${filename}" appears to be password protected. Please remove the password protection.`);
        }
      }
      throw error;
    }
  }

  private getWorksheet(workbook: XLSX.WorkBook, sheetIndex: number): XLSX.WorkSheet {
    if (!workbook.SheetNames.length) {
      throw new Error("No sheets found in the file");
    }

    if (sheetIndex >= workbook.SheetNames.length) {
      throw new Error(`Sheet index ${sheetIndex} is out of range. File has ${workbook.SheetNames.length} sheet(s).`);
    }

    const sheetName = workbook.SheetNames[sheetIndex];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error(`Could not read sheet "${sheetName}" at index ${sheetIndex}`);
    }

    return worksheet;
  }

  private convertToJson(worksheet: XLSX.WorkSheet): RowData[] {
    try {
      return XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: "",
        blankrows: false
      }) as RowData[];
    } catch (error) {
      throw new Error(`Failed to convert worksheet to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractHeaders(rawHeaders: string[], trimHeaders: boolean): string[] {
    return rawHeaders.map((header, index) => {
      if (trimHeaders) {
        return header && header.trim() !== "" ? header.trim() : `Column ${index + 1}`;
      }
      return header || `Column ${index + 1}`;
    });
  }

  private createFileInfo(headers: string[], dataRows: RowData[]): FileInfo {
    return {
      headers,
      totalRows: dataRows.length,
      sampleData: dataRows.slice(0, 3).map(row => 
        headers.reduce((obj, header, index) => {
          obj[header] = row[index] || "";
          return obj;
        }, {} as Record<string, string | number | boolean | null | undefined>)
      )
    };
  }

  private parseRows(dataRows: RowData[], headers: string[], skipEmptyRows: boolean): ParsedRow[] {
    let filteredRows = dataRows;
    
    if (skipEmptyRows) {
      filteredRows = dataRows.filter(row => row.some(cell => cell !== ""));
    }

    return filteredRows.map((row, index) => {
      const rowData: ParsedRow = {
        id: `row-${index + 1}`,
      };

      headers.forEach((header, colIndex) => {
        rowData[header] = row[colIndex] || "";
      });

      return rowData;
    });
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
  }

  private getErrorMessage(error: unknown, filename: string): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Handle common xlsx library errors
      if (message.includes("bad uncompressed size")) {
        return `The Excel file "${filename}" appears to be corrupted or in an unsupported format. Please try saving it as a new .xlsx file.`;
      }
      if (message.includes("invalid file")) {
        return `The file "${filename}" is not a valid Excel file. Please check the file format.`;
      }
      if (message.includes("password")) {
        return `The Excel file "${filename}" appears to be password protected. Please remove the password protection.`;
      }
      if (message.includes("not a zip file")) {
        return `The file "${filename}" is not a valid Excel file. It may be corrupted or in the wrong format.`;
      }
      if (message.includes("end of central directory")) {
        return `The Excel file "${filename}" appears to be corrupted. Please try opening and resaving it.`;
      }
      
      return error.message;
    }
    
    return `Unknown error occurred while parsing "${filename}"`;
  }
} 