"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const financeData = [
  {
    category: "Tithes",
    amount: 18500,
    target: 20000,
    percentage: 92.5,
  },
  {
    category: "Offerings",
    amount: 6080,
    target: 8000,
    percentage: 76,
  },
  {
    category: "Special Donations",
    amount: 3200,
    target: 5000,
    percentage: 64,
  },
  {
    category: "Building Fund",
    amount: 12400,
    target: 15000,
    percentage: 82.7,
  },
]

export function FinanceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Finance Overview</CardTitle>
        <CardDescription>Current month's financial progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {financeData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className="text-muted-foreground">
                  ${item.amount.toLocaleString()} / ${item.target.toLocaleString()}
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground">{item.percentage}% of target</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
