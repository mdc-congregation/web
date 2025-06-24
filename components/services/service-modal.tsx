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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "sunday_service",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    preacher: "",
    chairman: "",
    supporters: [] as string[],
    specialGuests: [] as string[],
    location: "",
    expectedAttendance: "",
    description: "",
    status: "scheduled",
    notes: "",
    announcementMessage: "",
    isRecurring: false,
    recurringType: "weekly",
    recurringDays: [] as string[],
  })

  const [newSupporter, setNewSupporter] = useState("")
  const [newGuest, setNewGuest] = useState("")

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        type: service.type || "sunday_service",
        startDate: service.startDate || "",
        endDate: service.endDate || "",
        startTime: service.startTime || "",
        endTime: service.endTime || "",
        preacher: service.preacher || "",
        chairman: service.chairman || "",
        supporters: service.supporters || [],
        specialGuests: service.specialGuests || [],
        location: service.location || "",
        expectedAttendance: service.expectedAttendance?.toString() || "",
        description: service.description || "",
        status: service.status || "scheduled",
        notes: service.notes || "",
        announcementMessage: service.announcementMessage || "",
        isRecurring: service.isRecurring || false,
        recurringType: service.recurringType || "weekly",
        recurringDays: service.recurringDays || [],
      })
    } else {
      setFormData({
        title: "",
        type: "sunday_service",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        preacher: "",
        chairman: "",
        supporters: [],
        specialGuests: [],
        location: "",
        expectedAttendance: "",
        description: "",
        status: "scheduled",
        notes: "",
        announcementMessage: "",
        isRecurring: false,
        recurringType: "weekly",
        recurringDays: [],
      })
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Service submitted:", formData)
    onClose()
  }

  const addSupporter = () => {
    if (newSupporter.trim() && !formData.supporters.includes(newSupporter.trim())) {
      setFormData({
        ...formData,
        supporters: [...formData.supporters, newSupporter.trim()],
      })
      setNewSupporter("")
    }
  }

  const removeSupporter = (supporter: string) => {
    setFormData({
      ...formData,
      supporters: formData.supporters.filter((s) => s !== supporter),
    })
  }

  const addGuest = () => {
    if (newGuest.trim() && !formData.specialGuests.includes(newGuest.trim())) {
      setFormData({
        ...formData,
        specialGuests: [...formData.specialGuests, newGuest.trim()],
      })
      setNewGuest("")
    }
  }

  const removeGuest = (guest: string) => {
    setFormData({
      ...formData,
      specialGuests: formData.specialGuests.filter((g) => g !== guest),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service ? "Update service information" : "Create a new service or event"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>

            <div className="min-h-[400px] mt-4">
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Sunday Morning Service"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Service Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday_service">Sunday Service</SelectItem>
                      <SelectItem value="prayer_meeting">Prayer Meeting</SelectItem>
                      <SelectItem value="bible_study">Bible Study</SelectItem>
                      <SelectItem value="special_event">Special Event</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="crusade">Crusade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Main Sanctuary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedAttendance">Expected Attendance</Label>
                    <Input
                      id="expectedAttendance"
                      type="number"
                      value={formData.expectedAttendance}
                      onChange={(e) => setFormData({ ...formData, expectedAttendance: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked as boolean })}
                    />
                    <Label htmlFor="isRecurring">Recurring Service</Label>
                  </div>

                  {formData.isRecurring && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="recurringType">Recurrence Pattern</Label>
                        <Select
                          value={formData.recurringType}
                          onValueChange={(value) => setFormData({ ...formData, recurringType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.recurringType === "weekly" && (
                        <div className="space-y-2">
                          <Label>Days of the Week</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                              (day) => (
                                <div key={day} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={day}
                                    checked={formData.recurringDays.includes(day)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setFormData({
                                          ...formData,
                                          recurringDays: [...formData.recurringDays, day],
                                        })
                                      } else {
                                        setFormData({
                                          ...formData,
                                          recurringDays: formData.recurringDays.filter((d) => d !== day),
                                        })
                                      }
                                    }}
                                  />
                                  <Label htmlFor={day} className="text-sm">
                                    {day.slice(0, 3)}
                                  </Label>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="leadership" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preacher">Preacher</Label>
                  <Input
                    id="preacher"
                    value={formData.preacher}
                    onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                    placeholder="Name of the preacher"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chairman">Chairman</Label>
                  <Input
                    id="chairman"
                    value={formData.chairman}
                    onChange={(e) => setFormData({ ...formData, chairman: e.target.value })}
                    placeholder="Name of the chairman"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supporters</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSupporter}
                      onChange={(e) => setNewSupporter(e.target.value)}
                      placeholder="Add supporter name"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSupporter())}
                    />
                    <Button type="button" onClick={addSupporter}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.supporters.map((supporter, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {supporter}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSupporter(supporter)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Guests</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newGuest}
                      onChange={(e) => setNewGuest(e.target.value)}
                      placeholder="Add guest name"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
                    />
                    <Button type="button" onClick={addGuest}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialGuests.map((guest, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {guest}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeGuest(guest)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service or event"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes or special instructions"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcementMessage">Announcement Message</Label>
                  <Textarea
                    id="announcementMessage"
                    value={formData.announcementMessage}
                    onChange={(e) => setFormData({ ...formData, announcementMessage: e.target.value })}
                    placeholder="Message to send as SMS or email reminder to members about this service"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be used for service reminders and notifications
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{service ? "Update Service" : "Create Service"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
