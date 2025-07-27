"use client";

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { documentParserService, ParseResult, FileInfo } from "@/lib/parsers";
import { formatCurrency } from "@/lib/utils/number-format";

interface MonthData {
  month: string;
  year: number;
  data: ParseResult['data'];
  positiveSum: number;
  negativeSum: number;
  totalSum: number;
}

export function ExpensesTable() {
  const [data, setData] = useState<ParseResult['data']>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

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
      setSelectedMonth("all"); // Reset to show all data initially
    } catch (error) {
      console.error("Error reading file:", error);
      setError(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const supportedExtensions = documentParserService.getSupportedExtensions();

  // Group data by month
  const monthlyData = useMemo(() => {
    if (!data.length || !headers.length) return [];

    // Use first column for dates
    const dateColumnIndex = 0;

    // Group by month
    const monthGroups = new Map<string, MonthData>();

    data.forEach(row => {
      const dateValue = row[headers[dateColumnIndex]];
      if (!dateValue) return;

      let date: Date;
      try {
        // Handle DD.MM.YYYY HH:MM:SS format
        if (typeof dateValue === 'string') {
          // Check if it matches DD.MM.YYYY HH:MM:SS format
          const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
          const match = dateValue.match(dateRegex);
          
          if (match) {
            const [, day, month, year, hour, minute, second] = match;
            // Create date with month-1 because JavaScript months are 0-indexed
            date = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              parseInt(hour),
              parseInt(minute),
              parseInt(second)
            );
          } else {
            // Fallback to standard date parsing
            date = new Date(dateValue);
          }
        } else if (typeof dateValue === 'number') {
          date = new Date(dateValue);
        } else {
          // For any other type, try to convert to string first
          date = new Date(String(dateValue));
        }

        if (isNaN(date.getTime())) return; // Invalid date
      } catch {
        return; // Date parsing failed
      }

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      if (!monthGroups.has(monthKey)) {
        monthGroups.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          data: [],
          positiveSum: 0,
          negativeSum: 0,
          totalSum: 0
        });
      }

      const monthData = monthGroups.get(monthKey)!;
      monthData.data.push(row);

      // Calculate column 5 sums
      if (headers.length >= 5) {
        const column5Value = row[headers[4]];
        if (column5Value !== null && column5Value !== undefined && column5Value !== '') {
          const numValue = typeof column5Value === 'number' ? column5Value : parseFloat(String(column5Value));
          if (!isNaN(numValue)) {
            if (numValue > 0) {
              monthData.positiveSum += numValue;
            } else if (numValue < 0) {
              monthData.negativeSum += numValue;
            }
            monthData.totalSum += numValue;
          }
        }
      }
    });

    // Convert to array and sort by date (oldest first, left to right)
    return Array.from(monthGroups.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        // Extract month number from month name for comparison
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const aMonthIndex = monthOrder.findIndex(month => a.month.startsWith(month));
        const bMonthIndex = monthOrder.findIndex(month => b.month.startsWith(month));
        return aMonthIndex - bMonthIndex;
      });
  }, [data, headers]);

  // Calculate overall sums for all data
  const overallSums = useMemo(() => {
    if (!data.length || !headers.length || headers.length < 5) return { positiveSum: 0, negativeSum: 0, totalSum: 0 };

    const column5Data = data.map(row => {
      const column5Value = row[headers[4]];
      if (column5Value === null || column5Value === undefined || column5Value === '') {
        return 0;
      }
      const numValue = typeof column5Value === 'number' ? column5Value : parseFloat(String(column5Value));
      return isNaN(numValue) ? 0 : numValue;
    });

    const positiveSum = column5Data.filter(value => value > 0).reduce((sum, value) => sum + value, 0);
    const negativeSum = column5Data.filter(value => value < 0).reduce((sum, value) => sum + value, 0);
    const totalSum = positiveSum + negativeSum;

    return { positiveSum, negativeSum, totalSum };
  }, [data, headers]);

  // Get current month data or all data
  const currentMonthData = useMemo(() => {
    if (selectedMonth === 'all') {
      return data;
    }
    return monthlyData.find(month => month.month === selectedMonth)?.data || [];
  }, [selectedMonth, monthlyData, data]);

  // Get current sums
  const currentSums = useMemo(() => {
    if (selectedMonth === 'all') {
      return overallSums;
    }
    const monthData = monthlyData.find(month => month.month === selectedMonth);
    return monthData ? {
      positiveSum: monthData.positiveSum,
      negativeSum: monthData.negativeSum,
      totalSum: monthData.totalSum
    } : { positiveSum: 0, negativeSum: 0, totalSum: 0 };
  }, [selectedMonth, monthlyData, overallSums]);

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
            <CardTitle>Data Table ({currentMonthData.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Month Tabs */}
            {monthlyData.length > 0 && (
              <div className="mb-4">
                <Tabs value={selectedMonth} onValueChange={setSelectedMonth} className="w-full">
                  <TabsList className="grid w-full grid-cols-auto-fit">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {monthlyData.map((monthData) => (
                      <TabsTrigger key={monthData.month} value={monthData.month}>
                        {monthData.month}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Summary Row */}
            {headers.length >= 5 && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Positive Sum</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(currentSums.positiveSum, { showPositiveSign: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Negative Sum</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(currentSums.negativeSum)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Column 5 Total</p>
                    <p className={`text-lg font-bold ${currentSums.totalSum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(currentSums.totalSum, { showPositiveSign: currentSums.totalSum >= 0 })}
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
                  {currentMonthData.map((row) => (
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