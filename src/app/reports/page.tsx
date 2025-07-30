"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Lightbulb,
  Save,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";

// Mock data - in real app this would come from API
const mockData = {
  monthlySpending: 3200,
  monthlyIncome: 6500,
  savingsRate: 50.8,
  topSpendingCategories: [
    { name: "Dining", amount: 450, percentage: 14.1, trend: "up", change: "+22%" },
    { name: "Transportation", amount: 380, percentage: 11.9, trend: "down", change: "-15%" },
    { name: "Shopping", amount: 320, percentage: 10.0, trend: "up", change: "+8%" },
    { name: "Entertainment", amount: 280, percentage: 8.8, trend: "up", change: "+12%" },
    { name: "Utilities", amount: 250, percentage: 7.8, trend: "stable", change: "0%" },
  ],
  monthlyTrends: [
    { month: "Jan", income: 6500, expenses: 3200, savings: 3300 },
    { month: "Feb", income: 6500, expenses: 3100, savings: 3400 },
    { month: "Mar", income: 6500, expenses: 3400, savings: 3100 },
    { month: "Apr", income: 6500, expenses: 3000, savings: 3500 },
    { month: "May", income: 6500, expenses: 3300, savings: 3200 },
    { month: "Jun", income: 6500, expenses: 3200, savings: 3300 },
  ],
  insights: [
    {
      type: "savings",
      title: "Savings Opportunity",
      message: "You could save $120/month by reducing subscription services",
      icon: Save,
      action: "Review subscriptions",
    },
    {
      type: "spending",
      title: "High Spending Alert",
      message: "Dining expenses are 22% higher than last month",
      icon: AlertTriangle,
      action: "View details",
    },
    {
      type: "goal",
      title: "Goal Progress",
      message: "You're on track to reach your savings goal by December",
      icon: Target,
      action: "Update goals",
    },
  ],
  recommendations: [
    {
      category: "Dining",
      suggestion: "Consider cooking at home more often",
      potentialSavings: 150,
      difficulty: "Medium",
    },
    {
      category: "Entertainment",
      suggestion: "Review and cancel unused subscriptions",
      potentialSavings: 80,
      difficulty: "Easy",
    },
    {
      category: "Transportation",
      suggestion: "Use public transport when possible",
      potentialSavings: 100,
      difficulty: "Hard",
    },
  ],
};

function ReportHeader() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedReport, setSelectedReport] = useState("Overview");

  return (
    <div className="flex items-center justify-between">
      <div>
        <Typography variant="h1">Reports & Analytics</Typography>
        <Typography variant="muted">
          Deep insights into your financial behavior and trends.
        </Typography>
      </div>
      <div className="flex gap-2">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Overview">Overview</SelectItem>
            <SelectItem value="Spending">Spending Analysis</SelectItem>
            <SelectItem value="Income">Income Analysis</SelectItem>
            <SelectItem value="Savings">Savings Report</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}

function FinancialSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            ${mockData.monthlyIncome.toLocaleString()}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            +12% from last month
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            ${mockData.monthlySpending.toLocaleString()}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            +8% from last month
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <Save className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            {mockData.savingsRate}%
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            ${(mockData.monthlyIncome - mockData.monthlySpending).toLocaleString()} saved
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <Typography variant="h3" className="font-bold">
            $45,250
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            +15% from last month
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function SpendingBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Spending Categories</CardTitle>
        <CardDescription>Breakdown of your highest expense categories this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.topSpendingCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div>
                    <Typography variant="small" className="font-medium">
                      {category.name}
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground">
                      {category.percentage}% of total spending
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="small" className="font-medium">
                    ${category.amount}
                  </Typography>
                  <div className="flex items-center gap-1">
                    {category.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                    {category.trend === "down" && (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    )}
                    <Typography variant="small" className="text-muted-foreground">
                      {category.change}
                    </Typography>
                  </div>
                </div>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>Income, expenses, and savings over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <Typography variant="small">Chart coming soon</Typography>
            <Typography variant="small" className="text-muted-foreground">
              Monthly trends visualization
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Insights
        </CardTitle>
        <CardDescription>AI-powered suggestions to improve your financial health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg border"
              >
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <Typography variant="small" className="font-medium mb-1">
                    {insight.title}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground mb-2">
                    {insight.message}
                  </Typography>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    {insight.action} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Recommendations</CardTitle>
        <CardDescription>Personalized suggestions to help you save more money</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Typography variant="small" className="font-medium">
                    {rec.category}
                  </Typography>
                  <Badge variant="outline" className="text-xs">
                    {rec.difficulty}
                  </Badge>
                </div>
                <Typography variant="small" className="text-muted-foreground">
                  {rec.suggestion}
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="small" className="font-medium text-green-600">
                  Save ${rec.potentialSavings}/month
                </Typography>
                <Button variant="outline" size="sm" className="mt-1">
                  Apply
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExportOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
        <CardDescription>Download your financial data in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <Typography variant="small" className="font-medium">
                PDF Report
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Detailed analysis
              </Typography>
            </div>
          </Button>

          <Button variant="outline" className="h-20 flex-col gap-2">
            <Download className="h-6 w-6" />
            <div className="text-center">
              <Typography variant="small" className="font-medium">
                CSV Export
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Raw transaction data
              </Typography>
            </div>
          </Button>

          <Button variant="outline" className="h-20 flex-col gap-2">
            <CreditCard className="h-6 w-6" />
            <div className="text-center">
              <Typography variant="small" className="font-medium">
                Google Sheets
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Sync with Sheets
              </Typography>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <ReportHeader />

        {/* Financial Summary */}
        <FinancialSummary />

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Spending Breakdown */}
          <div className="lg:col-span-1">
            <SpendingBreakdown />
          </div>

          {/* Monthly Trends */}
          <div className="lg:col-span-2">
            <MonthlyTrends />
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <InsightsCard />
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-1">
            <RecommendationsCard />
          </div>

          {/* Export Options */}
          <div className="lg:col-span-1">
            <ExportOptions />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
