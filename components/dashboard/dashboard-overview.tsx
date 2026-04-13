"use client"

import { AlertCircle, Calendar, CalendarCheck, Home, TrendingUp, UserPlus, Users } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity } from "./recent-activity"
import { UpcomingBirthdays } from "./upcoming-birthdays"
import { FinanceOverview } from "./finance-overview"

export function DashboardOverview() {
  const { stats, birthdays, loading, birthdaysLoading, error, showNextWeek, showPreviousWeek } = useDashboard()

  const statCards = stats ? [
    {
      title: "Total Members",
      value: stats.total_members.count.toLocaleString(),
      change: `${stats.total_members.percentage_growth}%`,
      changeType: stats.total_members.percentage_growth >= 0 ? "positive" as const : "negative" as const,
      icon: Users,
      description: "Active church members",
    },
    {
      title: "This Week Attendance",
      value: stats.attendance_this_week.count.toLocaleString(),
      change: `${stats.attendance_this_week.percentage_change}%`,
      changeType: stats.attendance_this_week.percentage_change >= 0 ? "positive" as const : "negative" as const,
      icon: Calendar,
      description: "Attendance recorded this week",
    },
    {
      title: "New Members",
      value: stats.new_members.count.toLocaleString(),
      change: `${stats.new_members.percentage_change}%`,
      changeType: stats.new_members.percentage_change >= 0 ? "positive" as const : "negative" as const,
      icon: UserPlus,
      description: "This month",
    },
    {
      title: "Families",
      value: stats.families.count.toLocaleString(),
      change: `${stats.families.percentage_growth}%`,
      changeType: stats.families.percentage_growth >= 0 ? "positive" as const : "negative" as const,
      icon: Home,
      description: `${stats.families.new_this_month} created this month`,
    },
    {
      title: "Upcoming Events",
      value: stats.upcoming_events.count.toLocaleString(),
      change: `${stats.upcoming_events.this_week_count} this week`,
      changeType: "neutral" as const,
      icon: CalendarCheck,
      description: "Scheduled events",
    },
    {
      title: "Growth Rate",
      value: `${stats.growth_rate}%`,
      change: "Year over year",
      changeType: stats.growth_rate >= 0 ? "positive" as const : "negative" as const,
      icon: TrendingUp,
      description: "Overall membership growth",
    },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at Freedom Temple.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="h-28 animate-pulse" />
          </Card>
        )) : statCards.map((stat) => (
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
                </span>
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
            <CardTitle>Upcoming Birthdays</CardTitle>
            <CardDescription>Member birthdays for the selected Sunday to Saturday week</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingBirthdays
              weekLabel={birthdays?.week.label}
              birthdays={birthdays?.birthdays ?? []}
              loading={birthdaysLoading}
              onPreviousWeek={showPreviousWeek}
              onNextWeek={showNextWeek}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={stats?.recent_activity ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Finance Overview */}
      <FinanceOverview />
    </div>
  )
}
