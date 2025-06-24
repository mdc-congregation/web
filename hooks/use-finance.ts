"use client"

import { useState, useEffect } from "react"

export function useFinance() {
  const [financeEvents, setFinanceEvents] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)

      // Mock financial events data
      const mockFinanceEvents = [
        {
          id: "1",
          name: "Youth Conference 2024",
          description: "Annual youth conference with guest speakers",
          startDate: "2024-03-15",
          endDate: "2024-03-17",
          budget: 15000,
          expenses: 8500,
          income: 12000,
          status: "active",
        },
        {
          id: "2",
          name: "Building Renovation",
          description: "Sanctuary renovation project",
          startDate: "2024-01-01",
          endDate: "2024-06-30",
          budget: 50000,
          expenses: 32000,
          income: 45000,
          status: "active",
        },
        {
          id: "3",
          name: "Christmas Outreach",
          description: "Community Christmas event and gifts",
          startDate: "2023-12-01",
          endDate: "2023-12-25",
          budget: 8000,
          expenses: 7500,
          income: 9200,
          status: "completed",
        },
      ]

      // Mock donations data
      const mockDonations = [
        {
          id: "1",
          donor: "John Smith",
          amount: 500,
          type: "tithe",
          method: "online",
          date: "2024-01-15",
          notes: "Monthly tithe",
        },
        {
          id: "2",
          donor: "Sarah Johnson",
          amount: 250,
          type: "offering",
          method: "cash",
          date: "2024-01-14",
          notes: "Sunday offering",
        },
        {
          id: "3",
          donor: "Michael Chen",
          amount: 1000,
          type: "special",
          method: "check",
          date: "2024-01-13",
          notes: "Building fund donation",
        },
        {
          id: "4",
          donor: "Emily Davis",
          amount: 300,
          type: "tithe",
          method: "card",
          date: "2024-01-12",
          notes: "",
        },
        {
          id: "5",
          donor: "David Wilson",
          amount: 150,
          type: "offering",
          method: "cash",
          date: "2024-01-11",
          notes: "Special offering for missions",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setFinanceEvents(mockFinanceEvents)
        setDonations(mockDonations)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return { financeEvents, donations, loading, error, refetch: fetchFinanceData }
}
