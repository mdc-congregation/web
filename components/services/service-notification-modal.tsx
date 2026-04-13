"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ServiceNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
  onSend: (serviceId: string, announcementMessage: string) => Promise<string>
  isSaving: boolean
}

export function ServiceNotificationModal({ isOpen, onClose, service, onSend, isSaving }: ServiceNotificationModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    message: "",
    messageType: "reminder",
  })

  useEffect(() => {
    if (service) {
      const defaultMessage =
        service.announcementMessage ||
        `Reminder: ${service.title} on ${service.date} at ${service.time}. Location: ${service.location}. We look forward to seeing you there!`

      setFormData({
        message: defaultMessage,
        messageType: "reminder",
      })
    }
  }, [service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return
    try {
      const message = await onSend(service.id, formData.message)
      toast({
        title: "Notification updated",
        description: message,
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Send failed",
        description: error instanceof Error ? error.message : "Unable to update service notification.",
      })
    }
  }

  const getMessageTemplate = (type: string) => {
    if (!service) return ""

    switch (type) {
      case "reminder":
        return `Reminder: ${service.title} on ${service.date} at ${service.time}. Location: ${service.location}. We look forward to seeing you there!`
      case "thank_you":
        return `Thank you for attending ${service.title} today! We hope you were blessed. See you next time!`
      case "custom":
        return service.announcementMessage || ""
      default:
        return ""
    }
  }

  const handleMessageTypeChange = (type: string) => {
    setFormData({
      ...formData,
      messageType: type,
      message: getMessageTemplate(type),
    })
  }

  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Service Notification</DialogTitle>
          <DialogDescription>Save the announcement message that the API prepares for service supporters.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Service Information</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Service:</span> {service.title}
              </div>
              <div>
                <span className="font-medium">Date:</span> {service.date}
              </div>
              <div>
                <span className="font-medium">Time:</span> {service.time}
              </div>
              <div>
                <span className="font-medium">Location:</span> {service.location}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="messageType">Message Type</Label>
              <Select value={formData.messageType} onValueChange={handleMessageTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">Service Reminder</SelectItem>
                  <SelectItem value="thank_you">Thank You Message</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message Content</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your message"
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">Character count: {formData.message.length}/160</p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              This endpoint targets supporters linked to the service who have phone numbers on file.
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Message"}</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
