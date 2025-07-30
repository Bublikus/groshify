"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";

// Mock data - in real app this would come from API
const mockData = {
  monthlyBudget: 5000,
  monthlySpent: 3200,
  monthlyIncome: 6500,
  savings: 3300,
  topCategories: [
    { name: "Dining", amount: 450, percentage: 14.1, trend: "up" },
    { name: "Transportation", amount: 380, percentage: 11.9, trend: "down" },
    { name: "Shopping", amount: 320, percentage: 10.0, trend: "up" },
    { name: "Entertainment", amount: 280, percentage: 8.8, trend: "up" },
    { name: "Utilities", amount: 250, percentage: 7.8, trend: "stable" },
  ],
  insights: [
    {
      type: "warning",
      message: "You spent 22% more this month on dining",
      icon: AlertTriangle,
    },
    {
      type: "success",
      message: "Great job! You're 15% under budget on transportation",
      icon: TrendingDown,
    },
    {
      type: "info",
      message: "Your savings rate is 50.8% this month",
      icon: TrendingUp,
    },
  ],
  recentTransactions: [
    {
      id: 1,
      description: "Netflix Subscription",
      amount: -15.99,
      category: "Entertainment",
      date: "2024-01-15",
    },
    { id: 2, description: "Grocery Store", amount: -85.5, category: "Food", date: "2024-01-14" },
    { id: 3, description: "Salary Deposit", amount: 6500, category: "Income", date: "2024-01-01" },
  ],
};

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Typography variant="h3" className="font-bold">
          {value}
        </Typography>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500 mr-1" />}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BudgetProgress() {
  const percentage = (mockData.monthlySpent / mockData.monthlyBudget) * 100;
  const remaining = mockData.monthlyBudget - mockData.monthlySpent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
        <CardDescription>
          ${mockData.monthlySpent.toLocaleString()} of ${mockData.monthlyBudget.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="mb-4" />
        <div className="flex justify-between text-sm">
          <span>Spent: ${mockData.monthlySpent.toLocaleString()}</span>
          <span className="text-green-600">Remaining: ${remaining.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
        <CardDescription>Smart suggestions to improve your finances</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockData.insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg border"
            >
              <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <Typography variant="small" className="flex-1">
                {insight.message}
              </Typography>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function TopCategoriesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Spending Categories</CardTitle>
        <CardDescription>This month&apos;s highest expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.topCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <Typography variant="small" className="font-medium">
                    {category.name}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    {category.percentage}% of total
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="small" className="font-medium">
                  ${category.amount}
                </Typography>
                {category.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500 ml-1" />}
                {category.trend === "down" && (
                  <TrendingDown className="h-3 w-3 text-green-500 ml-1" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentTransactionsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest activity in your accounts</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockData.recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <Typography variant="small" className="font-medium">
                    {transaction.description}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    {transaction.date}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography
                  variant="small"
                  className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
                <Badge variant="secondary" className="text-xs">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">Dashboard</Typography>
            <Typography variant="muted">
              Welcome back! Here&apos;s an overview of your finances.
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button>
              <PieChart className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Income"
            value={`$${mockData.monthlyIncome.toLocaleString()}`}
            change="+12% from last month"
            icon={TrendingUp}
            trend="up"
          />
          <StatCard
            title="Monthly Expenses"
            value={`$${mockData.monthlySpent.toLocaleString()}`}
            change="+8% from last month"
            icon={TrendingDown}
            trend="down"
          />
          <StatCard
            title="Total Savings"
            value={`$${mockData.savings.toLocaleString()}`}
            change="+15% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Budget Remaining"
            value={`$${(mockData.monthlyBudget - mockData.monthlySpent).toLocaleString()}`}
            icon={CreditCard}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Budget Progress */}
          <div className="lg:col-span-1">
            <BudgetProgress />
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <InsightsCard />
          </div>

          {/* Top Categories */}
          <div className="lg:col-span-1">
            <TopCategoriesCard />
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactionsCard />
          </div>

          {/* Placeholder for Charts */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Monthly spending overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <Typography variant="small">Chart coming soon</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
