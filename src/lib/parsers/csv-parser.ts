import { DocumentParser, ParseResult, ParserOptions, ParsedRow, FileInfo, CellValue } from "./types";

export class CSVParser implements DocumentParser {
  getSupportedExtensions(): string[] {
    return [".csv"];
  }

  canParse(file: File): boolean {
    const extension = this.getFileExtension(file.name);
    return this.getSupportedExtensions().includes(extension.toLowerCase());
  }

  async parse(file: File, options: ParserOptions = {}): Promise<ParseResult> {
    const {
      headerRow = 0,
      skipEmptyRows = true,
      trimHeaders = true
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) {
            reject(new Error("No data read from file"));
            return;
          }

          const lines = content.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length < 2) {
            reject(new Error("File appears to be empty or has no data rows"));
            return;
          }

          const headers = this.parseHeaders(lines[headerRow], trimHeaders);
          const dataRows = lines.slice(headerRow + 1);
          
          const fileInfo = this.createFileInfo(headers, dataRows);
          const parsedData = this.parseRows(dataRows, headers, skipEmptyRows);

          resolve({
            data: parsedData,
            headers,
            fileInfo
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  private parseHeaders(headerLine: string, trimHeaders: boolean): string[] {
    const headers = this.parseCSVLine(headerLine);
    return headers.map((header, index) => {
      if (trimHeaders) {
        return header && header.trim() !== "" ? header.trim() : `Column ${index + 1}`;
      }
      return header || `Column ${index + 1}`;
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private createFileInfo(headers: string[], dataRows: string[]): FileInfo {
    return {
      headers,
      totalRows: dataRows.length,
      sampleData: dataRows.slice(0, 3).map(row => {
        const values = this.parseCSVLine(row);
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || "";
          return obj;
        }, {} as Record<string, CellValue>);
      })
    };
  }

  private parseRows(dataRows: string[], headers: string[], skipEmptyRows: boolean): ParsedRow[] {
    let filteredRows = dataRows;
    
    if (skipEmptyRows) {
      filteredRows = dataRows.filter(row => row.trim() !== '');
    }

    return filteredRows.map((row, index) => {
      const values = this.parseCSVLine(row);
      const rowData: ParsedRow = {
        id: `row-${index + 1}`,
      };

      headers.forEach((header, colIndex) => {
        rowData[header] = values[colIndex] || "";
      });

      return rowData;
    });
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
  }
} 