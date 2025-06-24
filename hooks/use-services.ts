"use client"

import { useState, useEffect } from "react"

export function useServices() {
  const [services, setServices] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServicesData()
  }, [])

  const fetchServicesData = async () => {
    try {
      setLoading(true)

      // Mock services data
      const mockServices = [
        {
          id: "1",
          title: "Sunday Morning Service",
          type: "sunday_service",
          date: "2024-01-21",
          time: "10:00",
          preacher: "Pastor John Smith",
          chairman: "Elder Michael Chen",
          supporters: ["Deacon Sarah Johnson", "Brother David Wilson"],
          specialGuests: ["Evangelist Mary Brown"],
          location: "Main Sanctuary",
          expectedAttendance: 900,
          actualAttendance: 892,
          status: "completed",
          description: "Regular Sunday morning worship service",
        },
        {
          id: "2",
          title: "Youth Conference 2024",
          type: "conference",
          date: "2024-03-15",
          time: "09:00",
          preacher: "Pastor Youth Leader",
          chairman: "Youth Pastor Emily Davis",
          supporters: ["Youth Team Leader 1", "Youth Team Leader 2"],
          specialGuests: ["Guest Speaker Rev. James Wilson", "Worship Leader Lisa Anderson"],
          location: "Conference Hall",
          expectedAttendance: 300,
          status: "scheduled",
          description: "Annual youth conference with special guests and workshops",
        },
        {
          id: "3",
          title: "Prayer Meeting",
          type: "prayer_meeting",
          date: "2024-01-24",
          time: "19:00",
          preacher: "Pastor Assistant",
          chairman: "Prayer Coordinator",
          supporters: ["Prayer Team Leader"],
          specialGuests: [],
          location: "Prayer Room",
          expectedAttendance: 150,
          actualAttendance: 142,
          status: "completed",
          description: "Weekly prayer meeting for the church community",
        },
        {
          id: "4",
          title: "Easter Crusade",
          type: "crusade",
          date: "2024-03-29",
          time: "18:00",
          preacher: "Guest Evangelist Peter Johnson",
          chairman: "Senior Pastor",
          supporters: ["Associate Pastor", "Worship Leader", "Technical Team Lead"],
          specialGuests: ["Healing Minister Dr. Grace Thompson", "Choir Director Mark Davis"],
          location: "Main Sanctuary",
          expectedAttendance: 1200,
          status: "scheduled",
          description: "Special Easter crusade with healing and deliverance ministry",
        },
      ]

      // Mock attendance data
      const mockAttendance = [
        {
          id: "1",
          serviceTitle: "Sunday Morning Service",
          date: "2024-01-21",
          expectedAttendance: 900,
          actualAttendance: 892,
          attendanceRate: 99.1,
          type: "Sunday Service",
        },
        {
          id: "2",
          serviceTitle: "Prayer Meeting",
          date: "2024-01-24",
          expectedAttendance: 150,
          actualAttendance: 142,
          attendanceRate: 94.7,
          type: "Prayer Meeting",
        },
        {
          id: "3",
          serviceTitle: "Bible Study",
          date: "2024-01-17",
          expectedAttendance: 200,
          actualAttendance: 178,
          attendanceRate: 89.0,
          type: "Bible Study",
        },
        {
          id: "4",
          serviceTitle: "Sunday Evening Service",
          date: "2024-01-14",
          expectedAttendance: 600,
          actualAttendance: 520,
          attendanceRate: 86.7,
          type: "Sunday Service",
        },
        {
          id: "5",
          serviceTitle: "Youth Service",
          date: "2024-01-13",
          expectedAttendance: 250,
          actualAttendance: 195,
          attendanceRate: 78.0,
          type: "Youth Service",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setServices(mockServices)
        setAttendance(mockAttendance)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return { services, attendance, loading, error, refetch: fetchServicesData }
}
