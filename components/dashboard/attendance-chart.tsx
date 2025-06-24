"use client"

// Mock data for attendance chart
const attendanceData = [
  { week: "Week 1", attendance: 820 },
  { week: "Week 2", attendance: 850 },
  { week: "Week 3", attendance: 780 },
  { week: "Week 4", attendance: 920 },
  { week: "Week 5", attendance: 890 },
  { week: "Week 6", attendance: 860 },
  { week: "Week 7", attendance: 940 },
  { week: "Week 8", attendance: 880 },
  { week: "Week 9", attendance: 910 },
  { week: "Week 10", attendance: 870 },
  { week: "Week 11", attendance: 950 },
  { week: "Week 12", attendance: 892 },
]

export function AttendanceChart() {
  const maxAttendance = Math.max(...attendanceData.map((d) => d.attendance))

  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2 h-64">
        {attendanceData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-primary rounded-t w-full min-h-[20px] transition-all hover:opacity-80"
              style={{
                height: `${(data.attendance / maxAttendance) * 200}px`,
              }}
              title={`${data.week}: ${data.attendance} attendees`}
            />
            <span className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">{data.week}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>12 weeks ago</span>
        <span>This week</span>
      </div>
    </div>
  )
}
