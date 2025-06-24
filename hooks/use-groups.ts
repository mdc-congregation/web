"use client"

import { useState, useEffect } from "react"

export function useGroups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      // For demo purposes, using mock data
      const mockGroups = [
        {
          id: "1",
          name: "Worship Team",
          description: "Musicians and vocalists for Sunday services",
          type: "ministry",
          leader: "David Wilson",
          memberCount: 12,
          meetingSchedule: "Thursdays at 7:00 PM",
          status: "active",
        },
        {
          id: "2",
          name: "Young Adults",
          description: "Small group for adults ages 18-30",
          type: "small",
          leader: "Sarah Johnson",
          memberCount: 15,
          meetingSchedule: "Tuesdays at 6:30 PM",
          status: "active",
        },
        {
          id: "3",
          name: "Finance Committee",
          description: "Oversees church finances and budget",
          type: "committee",
          leader: "Michael Chen",
          memberCount: 5,
          meetingSchedule: "First Monday of each month",
          status: "active",
        },
        {
          id: "4",
          name: "Children's Ministry",
          description: "Sunday school and children's programs",
          type: "ministry",
          leader: "Emily Davis",
          memberCount: 8,
          meetingSchedule: "Sundays at 9:00 AM",
          status: "active",
        },
        {
          id: "5",
          name: "Prayer Group",
          description: "Weekly prayer meeting",
          type: "small",
          leader: "Lisa Brown",
          memberCount: 10,
          meetingSchedule: "Wednesdays at 7:00 PM",
          status: "active",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setGroups(mockGroups)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return { groups, loading, error, refetch: fetchGroups }
}
