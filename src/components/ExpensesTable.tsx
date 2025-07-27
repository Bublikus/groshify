"use client";

import { useState } from "react";
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
import { documentParserService, ParseResult, FileInfo } from "@/lib/parsers";
import { formatCurrency } from "@/lib/utils/number-format";

export function ExpensesTable() {
  const [data, setData] = useState<ParseResult['data']>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileInfo(null);
    
    try {
      // Check if file can be parsed
      if (!documentParserService.canParse(file)) {
        const supportedExtensions = documentParserService.getSupportedExtensions().join(', ');
        throw new Error(`Unsupported file type. Supported extensions: ${supportedExtensions}`);
      }

      // Parse the file
      const result = await documentParserService.parse(file);
      
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

  const supportedExtensions = documentParserService.getSupportedExtensions();

  // Calculate sums for column 5 (index 4)
  const column5Data = data.map(row => {
    const column5Value = row[headers[4]]; // Column 5 (index 4)
    if (column5Value === null || column5Value === undefined || column5Value === '') {
      return 0;
    }
    const numValue = typeof column5Value === 'number' ? column5Value : parseFloat(String(column5Value));
    return isNaN(numValue) ? 0 : numValue;
  });

  const positiveSum = column5Data
    .filter(value => value > 0)
    .reduce((sum, value) => sum + value, 0);

  const negativeSum = column5Data
    .filter(value => value < 0)
    .reduce((sum, value) => sum + value, 0);

  const totalSum = positiveSum + negativeSum;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Data File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">
                Upload File ({supportedExtensions.join(', ')})
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept={supportedExtensions.join(',')}
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            {isLoading && <p className="text-sm text-muted-foreground">Processing file...</p>}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Upload any supported file to display its contents in a table format.</p>
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
            {/* Summary Row */}
            {headers.length >= 5 && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Positive Sum</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(positiveSum, { showPositiveSign: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Negative Sum</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(negativeSum)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Total</p>
                    <p className={`text-lg font-bold ${totalSum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalSum, { showPositiveSign: totalSum >= 0 })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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