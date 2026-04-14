"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Loader2, MessageSquare, Users } from "lucide-react"
import type { CommunicationEvent, CommunicationEventDetails } from "@/hooks/use-communication"

interface CommunicationEventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event?: CommunicationEvent | null
  getEventDetails: (eventId: string) => Promise<CommunicationEventDetails>
}

export function CommunicationEventDetailsModal({
  isOpen,
  onClose,
  event,
  getEventDetails,
}: CommunicationEventDetailsModalProps) {
  const [details, setDetails] = useState<CommunicationEventDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !event?.id) {
      setDetails(null)
      return
    }

    let cancelled = false

    const fetchDetails = async () => {
      try {
        setLoading(true)
        setDetails(null)
        const response = await getEventDetails(event.id)

        if (!cancelled) {
          setDetails(response)
        }
      } catch {
        if (!cancelled) {
          setDetails(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchDetails()

    return () => {
      cancelled = true
    }
  }, [event?.id, getEventDetails, isOpen])

  const currentEvent = details ?? event

  if (!currentEvent) {
    return null
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "default"
      case "reminder":
        return "secondary"
      case "invitation":
        return "outline"
      case "birthday":
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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentEvent.title}</DialogTitle>
          <DialogDescription>Communication event details and SMS history</DialogDescription>
        </DialogHeader>

        {loading && !details ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading event details...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Created:</span>
                  <span>{currentEvent.createdDateLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <Badge variant={getTypeColor(currentEvent.type)}>{currentEvent.typeLabel}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(currentEvent.status)}>{currentEvent.status}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Messages sent:</span>
                  <span>{currentEvent.messagesSent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total recipients:</span>
                  <span>{currentEvent.totalRecipients}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{currentEvent.description || "No description provided."}</p>
            </div>

            {currentEvent.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Additional Notes</h3>
                  <p className="text-sm text-muted-foreground">{currentEvent.notes}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Message History</h3>
              {details?.messages.length ? (
                <div className="space-y-3">
                  {details.messages.map((message) => (
                    <div key={message.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-sm text-muted-foreground">{message.content}</div>
                        </div>
                        <Badge variant={message.status === "failed" ? "destructive" : message.status === "sent" ? "default" : "outline"}>
                          {message.status}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-3">
                        <div>{message.recipientTypeLabel}</div>
                        <div>{message.recipientCount} recipients</div>
                        <div>{message.sentDateLabel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No messages have been sent for this event yet.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
