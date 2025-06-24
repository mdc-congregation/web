"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Users, Calendar, MapPin, User, Clock, Phone, Mail } from "lucide-react"

interface GroupDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  group?: any
}

export function GroupDetailsModal({ isOpen, onClose, group }: GroupDetailsModalProps) {
  if (!group) return null

  // Mock group members data
  const groupMembers = [
    {
      id: "1",
      name: "John Smith",
      role: "Leader",
      phone: "+1234567890",
      email: "john@email.com",
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Co-Leader",
      phone: "+1234567891",
      email: "sarah@email.com",
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Mike Wilson",
      role: "Member",
      phone: "+1234567892",
      email: "mike@email.com",
      avatar: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Member",
      phone: "+1234567893",
      email: "emily@email.com",
      avatar: "/placeholder.svg",
    },
    {
      id: "5",
      name: "David Brown",
      role: "Member",
      phone: "+1234567894",
      email: "david@email.com",
      avatar: "/placeholder.svg",
    },
  ]

  // Mock recent activities
  const recentActivities = [
    { date: "2024-01-14", activity: "Weekly meeting held", attendees: 12 },
    { date: "2024-01-07", activity: "Bible study session", attendees: 15 },
    { date: "2023-12-31", activity: "Year-end fellowship", attendees: 18 },
    { date: "2023-12-24", activity: "Christmas celebration", attendees: 20 },
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ministry":
        return "Ministry Team"
      case "small":
        return "Small Group"
      case "committee":
        return "Committee"
      default:
        return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {group.name}
          </DialogTitle>
          <DialogDescription>{group.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getTypeLabel(group.type)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={group.status === "active" ? "default" : "secondary"}>{group.status}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Leader: {group.leader}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Members: {group.memberCount}</span>
                  </div>
                  {group.meetingSchedule && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Schedule: {group.meetingSchedule}</span>
                    </div>
                  )}
                  {group.meetingLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Location: {group.meetingLocation}</span>
                    </div>
                  )}
                </div>

                {group.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{group.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">{activity.activity}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.attendees} attendees
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Members</CardTitle>
                <CardDescription>{groupMembers.length} total members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {groupMembers.map((member, index) => (
                    <div key={member.id}>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <Badge variant={member.role === "Leader" ? "default" : "secondary"} className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate">{member.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          </div>
                        </div>
                      </div>
                      {index < groupMembers.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Group Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Average Attendance:</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Meetings This Month:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Since:</span>
                  <span className="font-medium">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Growth Rate:</span>
                  <span className="font-medium text-green-600">+15%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
