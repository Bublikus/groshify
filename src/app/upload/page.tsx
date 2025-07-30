"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Info,
  Upload,
} from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { UploadInput } from "@/components/common/UploadInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

// Mock data - in real app this would come from API
const mockUploadHistory = [
  {
    id: 1,
    fileName: "bank_export_jan_2024.csv",
    fileSize: "2.4 MB",
    uploadDate: "2024-01-15T10:30:00Z",
    status: "completed",
    transactions: 156,
    categories: 8,
    source: "Bank of America",
  },
  {
    id: 2,
    fileName: "credit_card_statement.xlsx",
    fileSize: "1.8 MB",
    uploadDate: "2024-01-10T14:20:00Z",
    status: "completed",
    transactions: 89,
    categories: 6,
    source: "Chase Bank",
  },
  {
    id: 3,
    fileName: "paypal_transactions.csv",
    fileSize: "0.9 MB",
    uploadDate: "2024-01-08T09:15:00Z",
    status: "processing",
    transactions: 45,
    categories: 4,
    source: "PayPal",
  },
];

const supportedFormats = [
  { name: "CSV", description: "Comma-separated values", icon: "📄" },
  { name: "Excel", description: "Microsoft Excel files", icon: "📊" },
  { name: "JSON", description: "JavaScript Object Notation", icon: "🔧" },
  { name: "PDF", description: "Portable Document Format", icon: "📋" },
];

function UploadHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Typography variant="h1">Upload Data</Typography>
        <Typography variant="muted">
          Import your financial transactions from various sources.
        </Typography>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
        <Button variant="outline">
          <Info className="h-4 w-4 mr-2" />
          Help
        </Button>
      </div>
    </div>
  );
}

function UploadArea() {
  const handleFileSelect = (file: File) => {
    console.log("File selected:", file);
    // Handle file upload logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New File
        </CardTitle>
        <CardDescription>Drag and drop your transaction file or click to browse</CardDescription>
      </CardHeader>
      <CardContent>
        <UploadInput
          onFileSelect={handleFileSelect}
          acceptedFileTypes={[".csv", ".xlsx", ".xls", ".json", ".pdf"]}
          dragDropText="Drag and drop your transaction file here, or click to browse"
          supportedExtensionsText="Supported: CSV, Excel, JSON, PDF"
        />
      </CardContent>
    </Card>
  );
}

function SupportedFormats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported Formats</CardTitle>
        <CardDescription>
          We support various file formats for importing your financial data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportedFormats.map((format, index) => (
            <motion.div
              key={format.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border rounded-lg text-center"
            >
              <div className="text-3xl mb-2">{format.icon}</div>
              <Typography variant="small" className="font-medium">
                {format.name}
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {format.description}
              </Typography>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UploadHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Uploads
        </CardTitle>
        <CardDescription>Your recent file uploads and their processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUploadHistory.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <Typography variant="small" className="font-medium">
                    {upload.fileName}
                  </Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <Typography variant="small" className="text-muted-foreground">
                      {upload.fileSize}
                    </Typography>
                    <span className="text-muted-foreground">•</span>
                    <Typography variant="small" className="text-muted-foreground">
                      {upload.source}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {upload.transactions} transactions
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {upload.categories} categories
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Typography variant="small" className="text-muted-foreground">
                    {new Date(upload.uploadDate).toLocaleDateString()}
                  </Typography>
                  <div className="flex items-center gap-1 mt-1">
                    {upload.status === "completed" ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <Typography variant="small" className="text-green-600">
                          Completed
                        </Typography>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                        <Typography variant="small" className="text-yellow-600">
                          Processing
                        </Typography>
                      </>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UploadStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {mockUploadHistory.length}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Files uploaded this month
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {mockUploadHistory.reduce((sum, upload) => sum + upload.transactions, 0)}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Transactions imported
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            98%
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Successful uploads
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            2.3s
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Average processing time
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function UploadTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Upload Tips
        </CardTitle>
        <CardDescription>Best practices for successful data imports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <Typography variant="small" className="font-medium">
                File Format
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Ensure your file is in CSV, Excel, or JSON format for best compatibility
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <Typography variant="small" className="font-medium">
                Column Headers
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Include clear column headers like &quot;Date&quot;, &quot;Description&quot;,
                &quot;Amount&quot;, &quot;Category&quot;
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <Typography variant="small" className="font-medium">
                Date Format
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Use consistent date formats (MM/DD/YYYY or YYYY-MM-DD) throughout your file
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <div>
              <Typography variant="small" className="font-medium">
                File Size
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Keep files under 10MB for optimal processing speed
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UploadPage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <UploadHeader />

        {/* Upload Stats */}
        <UploadStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <UploadArea />
            <SupportedFormats />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <UploadHistory />
            <UploadTips />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
