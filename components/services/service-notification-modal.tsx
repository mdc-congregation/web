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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface ServiceNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
}

export function ServiceNotificationModal({ isOpen, onClose, service }: ServiceNotificationModalProps) {
  const [formData, setFormData] = useState({
    message: "",
    messageType: "reminder",
    selectedGroups: [] as string[],
  })

  const [availableGroups] = useState([
    { id: "all_members", name: "All Members" },
    { id: "worship_team", name: "Worship Team" },
    { id: "youth_group", name: "Youth Group" },
    { id: "prayer_group", name: "Prayer Group" },
  ])

  useEffect(() => {
    if (service) {
      const defaultMessage =
        service.announcementMessage ||
        `Reminder: ${service.title} on ${service.date} at ${service.time}. Location: ${service.location}. We look forward to seeing you there!`

      setFormData({
        message: defaultMessage,
        messageType: "reminder",
        selectedGroups: ["all_members"],
      })
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Notification sent:", formData)
    onClose()
  }

  const handleGroupToggle = (groupId: string) => {
    setFormData({
      ...formData,
      selectedGroups: formData.selectedGroups.includes(groupId)
        ? formData.selectedGroups.filter((id) => id !== groupId)
        : [...formData.selectedGroups, groupId],
    })
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
          <DialogDescription>Send SMS notification to members about this service</DialogDescription>
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

            <div className="space-y-3">
              <Label>Select Recipients</Label>
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={group.id}
                      checked={formData.selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleGroupToggle(group.id)}
                    />
                    <label
                      htmlFor={group.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {group.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.selectedGroups.map((groupId) => {
                  const group = availableGroups.find((g) => g.id === groupId)
                  return (
                    <Badge key={groupId} variant="secondary">
                      {group?.name}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Send SMS</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
