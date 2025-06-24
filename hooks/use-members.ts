"use client"

import { useState, useEffect } from "react"

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      // For demo purposes, using mock data
      const mockMembers = [
        {
          id: "1",
          name: "John Smith",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@email.com",
          phone: "(555) 123-4567",
          status: "active",
          joinDate: "2023-01-15",
          family: "Smith Family",
          ministry: "Worship Team",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@email.com",
          phone: "(555) 234-5678",
          status: "active",
          joinDate: "2023-03-22",
          family: "Johnson Family",
          ministry: "Children's Ministry",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "3",
          name: "Michael Chen",
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@email.com",
          phone: "(555) 345-6789",
          status: "active",
          joinDate: "2022-11-08",
          family: "Chen Family",
          ministry: "Youth Group",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setMembers(mockMembers)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return { members, loading, error, refetch: fetchMembers }
}
