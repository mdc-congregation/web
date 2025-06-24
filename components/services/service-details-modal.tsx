"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface ServiceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
}

export function ServiceDetailsModal({ isOpen, onClose, service }: ServiceDetailsModalProps) {
  if (!service) return null

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sunday_service":
        return "Sunday Service"
      case "prayer_meeting":
        return "Prayer Meeting"
      case "bible_study":
        return "Bible Study"
      case "special_event":
        return "Special Event"
      case "conference":
        return "Conference"
      case "crusade":
        return "Crusade"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "outline"
      case "ongoing":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service.title}</DialogTitle>
          <DialogDescription>Complete service information and details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{service.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time:</span>
                  <span>{service.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{service.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Type:</span>
                  <Badge variant="outline" className="ml-2">
                    {getTypeLabel(service.type)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(service.status)} className="ml-2">
                    {service.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Expected Attendance:</span>
                  <span>{service.expectedAttendance}</span>
                </div>
                {service.actualAttendance && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Actual Attendance:</span>
                    <span>{service.actualAttendance}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Leadership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Leadership</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Preacher:</span>
                <span className="ml-2">{service.preacher}</span>
              </div>
              <div>
                <span className="font-medium">Chairman:</span>
                <span className="ml-2">{service.chairman}</span>
              </div>
              {service.supporters && service.supporters.length > 0 && (
                <div>
                  <span className="font-medium">Supporters:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {service.supporters.map((supporter: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {supporter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {service.specialGuests && service.specialGuests.length > 0 && (
                <div>
                  <span className="font-medium">Special Guests:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {service.specialGuests.map((guest: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {guest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            {service.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
              </div>
            )}
            {service.announcementMessage && (
              <div>
                <span className="font-medium">Announcement Message:</span>
                <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded">{service.announcementMessage}</p>
              </div>
            )}
            {service.notes && (
              <div>
                <span className="font-medium">Notes:</span>
                <p className="mt-1 text-sm text-muted-foreground">{service.notes}</p>
              </div>
            )}
          </div>

          {/* Recurring Information */}
          {service.isRecurring && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recurring Information</h3>
                <div>
                  <span className="font-medium">Recurrence Pattern:</span>
                  <span className="ml-2 capitalize">{service.recurringType}</span>
                </div>
                {service.recurringDays && service.recurringDays.length > 0 && (
                  <div>
                    <span className="font-medium">Days:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {service.recurringDays.map((day: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
