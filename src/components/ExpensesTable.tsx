"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RawData {
  id: string;
  [key: string]: any;
}

export function ExpensesTable() {
  const [data, setData] = useState<RawData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    headers: string[];
    totalRows: number;
    sampleData: any[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileInfo(null);
    
    try {
      const result = await readExcelFile(file);
      setData(result.data);
      setHeaders(result.headers);
      setFileInfo(result.fileInfo);
    } catch (error) {
      console.error("Error reading file:", error);
      setError(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const readExcelFile = (file: File): Promise<{ data: RawData[], headers: string[], fileInfo: { headers: string[], totalRows: number, sampleData: any[] } }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("No data read from file"));
            return;
          }

          let workbook: XLSX.WorkBook;
          
          if (typeof data === 'string') {
            // Handle CSV or other text-based formats
            workbook = XLSX.read(data, { type: 'string' });
          } else {
            // Handle binary formats (xlsx, xls)
            workbook = XLSX.read(new Uint8Array(data as ArrayBuffer), { 
              type: 'array',
              cellDates: true,
              cellNF: false,
              cellText: false
            });
          }

          if (!workbook.SheetNames.length) {
            reject(new Error("No sheets found in the file"));
            return;
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          if (!worksheet) {
            reject(new Error("Could not read the first sheet"));
            return;
          }

          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: "",
            blankrows: false
          });

          if (!jsonData || jsonData.length < 2) {
            reject(new Error("File appears to be empty or has no data rows"));
            return;
          }

          // Get headers from first row
          const rawHeaders = jsonData[0] as string[];
          const dataRows = jsonData.slice(1) as any[][];

          // Clean headers (remove empty ones and provide defaults)
          const cleanHeaders = rawHeaders.map((header, index) => 
            header && header.trim() !== "" ? header.trim() : `Column ${index + 1}`
          );

          // Show file info
          const fileInfo = {
            headers: cleanHeaders,
            totalRows: dataRows.length,
            sampleData: dataRows.slice(0, 3).map(row => 
              cleanHeaders.reduce((obj, header, index) => {
                obj[header] = row[index] || "";
                return obj;
              }, {} as any)
            )
          };

          // Transform the data - keep everything as is
          const tableData: RawData[] = dataRows
            .filter(row => row.some(cell => cell !== "")) // Filter out completely empty rows
            .map((row, index) => {
              const rowData: RawData = {
                id: `row-${index + 1}`,
              };

              // Add each column exactly as it appears
              cleanHeaders.forEach((header, colIndex) => {
                rowData[header] = row[colIndex] || "";
              });

              return rowData;
            });

          resolve({ data: tableData, headers: cleanHeaders, fileInfo });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      
      // Read as ArrayBuffer for binary files
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Data File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Excel File (.xlsx, .xls) or CSV</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            {isLoading && <p className="text-sm text-muted-foreground">Processing file...</p>}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Upload any Excel or CSV file to display its contents in a table format.</p>
              <p>All columns and data will be displayed exactly as they appear in your file.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {fileInfo && (
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Columns ({fileInfo.headers.length}):</p>
                <p className="text-sm text-muted-foreground">{fileInfo.headers.join(', ')}</p>
              </div>
              <div>
                <p className="font-medium">Total Rows: {fileInfo.totalRows}</p>
              </div>
              {fileInfo.sampleData.length > 0 && (
                <div>
                  <p className="font-medium">Sample Data:</p>
                  <div className="mt-2 space-y-2">
                    {fileInfo.sampleData.map((row, index) => (
                      <div key={index} className="text-sm bg-muted p-2 rounded">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(row, null, 2)}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Table ({data.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      {headers.map(header => (
                        <TableCell key={header}>
                          {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 