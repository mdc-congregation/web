"use client"

import { useState, useEffect } from "react"

export function useCommunication() {
  const [events, setEvents] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCommunicationData()
  }, [])

  const fetchCommunicationData = async () => {
    try {
      setLoading(true)

      // Mock communication events data
      const mockEvents = [
        {
          id: "1",
          title: "Sunday Service Reminder",
          description: "Weekly reminder for Sunday morning service",
          createdDate: "2024-01-15",
          status: "active",
          messagesSent: 45,
          totalRecipients: 1200,
          type: "reminder",
        },
        {
          id: "2",
          title: "Youth Conference Invitation",
          description: "Invitation to the annual youth conference",
          createdDate: "2024-01-10",
          status: "completed",
          messagesSent: 12,
          totalRecipients: 300,
          type: "invitation",
        },
        {
          id: "3",
          title: "Prayer Meeting Announcement",
          description: "Special prayer meeting for church growth",
          createdDate: "2024-01-08",
          status: "active",
          messagesSent: 8,
          totalRecipients: 150,
          type: "announcement",
        },
        {
          id: "4",
          title: "Monthly Newsletter",
          description: "January 2024 church newsletter",
          createdDate: "2024-01-01",
          status: "completed",
          messagesSent: 25,
          totalRecipients: 1156,
          type: "newsletter",
        },
        {
          id: "5",
          title: "Building Fund Update",
          description: "Update on building renovation progress",
          createdDate: "2024-01-20",
          status: "draft",
          messagesSent: 0,
          totalRecipients: 0,
          type: "announcement",
        },
      ]

      // Mock messages data
      const mockMessages = [
        {
          id: "1",
          subject: "Sunday Service Reminder - This Week",
          type: "email",
          recipientType: "group",
          recipientCount: 1200,
          sentDate: "2024-01-21",
          status: "delivered",
          eventTitle: "Sunday Service Reminder",
        },
        {
          id: "2",
          subject: "Youth Conference Registration Open",
          type: "sms",
          recipientType: "group",
          recipientCount: 300,
          sentDate: "2024-01-20",
          status: "sent",
          eventTitle: "Youth Conference Invitation",
        },
        {
          id: "3",
          subject: "Prayer Meeting Tonight",
          type: "email",
          recipientType: "individual",
          recipientCount: 25,
          sentDate: "2024-01-19",
          status: "delivered",
          eventTitle: "Prayer Meeting Announcement",
        },
        {
          id: "4",
          subject: "Welcome to Grace Church",
          type: "email",
          recipientType: "individual",
          recipientCount: 1,
          sentDate: "2024-01-18",
          status: "delivered",
        },
        {
          id: "5",
          subject: "Building Fund Progress Update",
          type: "sms",
          recipientType: "group",
          recipientCount: 500,
          sentDate: "2024-01-17",
          status: "failed",
          eventTitle: "Building Fund Update",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setEvents(mockEvents)
        setMessages(mockMessages)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return { events, messages, loading, error, refetch: fetchCommunicationData }
}
