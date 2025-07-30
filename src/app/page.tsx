"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ThemeToggle } from "@/components/providers/theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { navigationItems, quickActions } from "@/constants/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Typography variant="h1" className="mb-4">
              Welcome to Groshify
            </Typography>
            <Typography variant="lead" className="mb-6">
              Your personal finance management companion
            </Typography>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(item.href)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Typography variant="h2" className="mb-6">
              Quick Actions
            </Typography>
            <div className="flex items-center justify-center gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.href}
                    variant="outline"
                    size="lg"
                    onClick={() => router.push(action.href)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Redirect Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 p-4 bg-muted rounded-lg"
          >
            <Typography variant="small" className="text-muted-foreground">
              Redirecting to Dashboard in a few seconds...
            </Typography>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
