"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MessageSquare, Users, Mail } from "lucide-react"

interface CommunicationEventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event?: any
}

export function CommunicationEventDetailsModal({ isOpen, onClose, event }: CommunicationEventDetailsModalProps) {
  if (!event) return null

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "default"
      case "reminder":
        return "secondary"
      case "invitation":
        return "outline"
      case "newsletter":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>Communication event details and statistics</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Created:</span>
                  <span>{event.createdDate}</span>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <Badge variant={getTypeColor(event.type)} className="ml-2">
                    {event.type}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(event.status)} className="ml-2">
                    {event.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Messages Sent:</span>
                  <span>{event.messagesSent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total Recipients:</span>
                  <span>{event.totalRecipients}</span>
                </div>
                {event.messagesSent > 0 && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Delivery Rate:</span>
                    <span>{Math.round((event.messagesSent / event.totalRecipients) * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          {/* Additional Notes */}
          {event.notes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Notes</h3>
                <p className="text-muted-foreground">{event.notes}</p>
              </div>
            </>
          )}

          {/* Message Statistics */}
          {event.messagesSent > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Message Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{event.messagesSent}</div>
                    <div className="text-sm text-muted-foreground">Sent</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(event.messagesSent * 0.95)}</div>
                    <div className="text-sm text-muted-foreground">Delivered</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {event.messagesSent - Math.round(event.messagesSent * 0.95)}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
