"use client";

import { motion } from "framer-motion";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { Category } from "../types";

interface RulesCardProps {
  displayCategories: Category[];
  totalRules: number;
  activeRules: number;
}

export function RulesCard({ displayCategories, totalRules, activeRules }: RulesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Categorization Rules</CardTitle>
        <CardDescription>
          Rules are applied in order. First matching rule wins. ({activeRules}/{totalRules} active)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{category.icon}</div>
                  <Typography variant="small" className="font-medium">
                    {category.name}
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-2">
                {category.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${rule.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <Typography variant="small">
                        {rule.condition} &quot;{rule.value}&quot;
                      </Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
