"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AttendanceRecord {
  id: string
  serviceTitle: string
  date: string
  expectedAttendance: number
  actualAttendance: number
  attendanceRate: number
  type: string
}

interface AttendanceTableProps {
  attendance: AttendanceRecord[]
  loading: boolean
}

export function AttendanceTable({ attendance, loading }: AttendanceTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading attendance records...</div>
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Attendance Rate</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.serviceTitle}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.expectedAttendance}</TableCell>
              <TableCell className="font-medium">{record.actualAttendance}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${getAttendanceColor(record.attendanceRate)}`}>
                      {record.attendanceRate}%
                    </span>
                  </div>
                  <Progress value={record.attendanceRate} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{record.type}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
