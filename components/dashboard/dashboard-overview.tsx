"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp, UserPlus, CalendarCheck } from "lucide-react"
import { RecentActivity } from "./recent-activity"
import { AttendanceChart } from "./attendance-chart"
import { FinanceOverview } from "./finance-overview"

const stats = [
  {
    title: "Total Members",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active church members",
  },
  {
    title: "This Week Attendance",
    value: "892",
    change: "+5%",
    changeType: "positive" as const,
    icon: Calendar,
    description: "Sunday service attendance",
  },
  {
    title: "Monthly Donations",
    value: "$24,580",
    change: "+8%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Tithes and offerings",
  },
  {
    title: "New Members",
    value: "23",
    change: "+15%",
    changeType: "positive" as const,
    icon: UserPlus,
    description: "This month",
  },
  {
    title: "Upcoming Events",
    value: "8",
    change: "2 this week",
    changeType: "neutral" as const,
    icon: CalendarCheck,
    description: "Scheduled events",
  },
  {
    title: "Growth Rate",
    value: "12.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Year over year",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at Grace Church.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Weekly service attendance for the past 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Finance Overview */}
      <FinanceOverview />
    </div>
  )
}
