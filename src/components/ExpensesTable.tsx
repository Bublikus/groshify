"use client";

import { useState, useMemo, useRef } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);

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

  const scrollToMonth = (direction: 'left' | 'right') => {
    if (!tabsRef.current || monthlyData.length === 0) return;

    const currentIndex = monthlyData.findIndex(month => month.month === selectedMonth);
    if (currentIndex === -1) return;

    let targetIndex: number;
    if (direction === 'left') {
      targetIndex = Math.max(0, currentIndex - 1);
    } else {
      targetIndex = Math.min(monthlyData.length - 1, currentIndex + 1);
    }

    const targetMonth = monthlyData[targetIndex];
    setSelectedMonth(targetMonth.month);

    // Scroll to center the target tab
    setTimeout(() => {
      if (tabsRef.current) {
        const tabsContainer = tabsRef.current;
        const tabElements = tabsContainer.querySelectorAll('[data-state]');
        const targetTab = tabElements[targetIndex + 1]; // +1 because "All" tab is first
        
        if (targetTab) {
          const containerWidth = tabsContainer.offsetWidth;
          const tabLeft = (targetTab as HTMLElement).offsetLeft;
          const tabWidth = (targetTab as HTMLElement).offsetWidth;
          const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
          
          tabsContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
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
        <Collapsible open={isFileInfoOpen} onOpenChange={setIsFileInfoOpen}>
          <Card className="py-0">
            <CardHeader className="p-0 block">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between text-left hover:bg-accent/50 rounded-md p-6 transition-colors cursor-pointer">
                  <CardTitle>File Information</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform ${isFileInfoOpen ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent className="pb-6">
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
            </CollapsibleContent>
          </Card>
        </Collapsible>
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
                  <div className="relative flex items-center">
                    {/* Left Arrow Button */}
                    <button
                      onClick={() => scrollToMonth('left')}
                      disabled={selectedMonth === 'all' || monthlyData.findIndex(month => month.month === selectedMonth) === 0}
                      className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94627 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </button>

                    {/* Right Arrow Button */}
                    <button
                      onClick={() => scrollToMonth('right')}
                      disabled={selectedMonth === 'all' || monthlyData.findIndex(month => month.month === selectedMonth) === monthlyData.length - 1}
                      className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6758 5.94673 11.3594 6.1356 11.1579L9.56501 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </button>

                    {/* Scrollable Tabs Container */}
                    <div 
                      ref={tabsRef}
                      className="flex-1 overflow-x-auto scrollbar-hide mx-10"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <TabsList className="flex w-max h-8">
                        <TabsTrigger value="all" className="shrink-0 px-6">All</TabsTrigger>
                        {monthlyData.map((monthData) => (
                          <TabsTrigger key={monthData.month} value={monthData.month} className="shrink-0 px-6">
                            {monthData.month}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </div>
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