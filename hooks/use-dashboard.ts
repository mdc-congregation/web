"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type DashboardStatsResponse = {
  total_members: {
    count: number
    percentage_growth: number
  }
  families: {
    count: number
    percentage_growth: number
    new_this_month: number
    new_last_month: number
  }
  attendance_this_week: {
    count: number
    percentage_change: number
  }
  new_members: {
    count: number
    percentage_change: number
  }
  upcoming_events: {
    count: number
    this_week_count: number
  }
  growth_rate: number
  recent_activity: Array<{
    name: string
    action: string
    timestamp: string
  }>
}

type UpcomingBirthdaysResponse = {
  week_offset: number
  week: {
    start_date: string
    end_date: string
    label: string
  }
  birthdays: Array<{
    id: string
    name: string
    date_of_birth: string | null
    phone_number: string | null
    birthday_date: string
    birthday_day: string
  }>
  pagination: {
    current_page: number
    previous_page: number
    next_page: number
    previous_page_url: string
    next_page_url: string
  }
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [birthdays, setBirthdays] = useState<UpcomingBirthdaysResponse | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [birthdaysLoading, setBirthdaysLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    const response = await (api.dashboard.getStats() as Promise<ApiResponse<DashboardStatsResponse>>)
    setStats(response.data)
  }, [])

  const fetchBirthdays = useCallback(async (offset: number) => {
    setBirthdaysLoading(true)
    try {
      const response = await (api.dashboard.getUpcomingBirthdays(String(offset)) as Promise<
        ApiResponse<UpcomingBirthdaysResponse>
      >)
      setBirthdays(response.data)
    } finally {
      setBirthdaysLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError(null)
        await Promise.all([fetchStats(), fetchBirthdays(0)])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.")
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [fetchBirthdays, fetchStats])

  const changeWeek = useCallback(
    async (nextOffset: number) => {
      try {
        setError(null)
        setWeekOffset(nextOffset)
        await fetchBirthdays(nextOffset)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load birthdays.")
      }
    },
    [fetchBirthdays],
  )

  return {
    stats,
    birthdays,
    loading,
    birthdaysLoading,
    error,
    weekOffset,
    showPreviousWeek: () => changeWeek(weekOffset - 1),
    showNextWeek: () => changeWeek(weekOffset + 1),
    reload: async () => {
      await Promise.all([fetchStats(), fetchBirthdays(weekOffset)])
    },
  }
}
