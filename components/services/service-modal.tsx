"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { emptyServiceFormValues, type ServiceFormValues } from "@/utils/services"
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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
  memberOptions: Array<{ id: string; name: string; phone?: string | null }>
  onSave: (formData: ServiceFormValues, existingService?: any) => Promise<{ message: string }>
  isSaving: boolean
}

export function ServiceModal({ isOpen, onClose, service, memberOptions, onSave, isSaving }: ServiceModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ServiceFormValues>(emptyServiceFormValues())
  const [newGuestName, setNewGuestName] = useState("")
  const [newGuestTitle, setNewGuestTitle] = useState("")
  const [supporterMemberId, setSupporterMemberId] = useState("")
  const [supporterRole, setSupporterRole] = useState("supporter")

  useEffect(() => {
    setFormData(service ? { ...emptyServiceFormValues(), ...service } : emptyServiceFormValues())
  }, [service, isOpen])

  const addGuest = () => {
    if (!newGuestName.trim()) return
    setFormData((prev) => ({
      ...prev,
      specialGuests: [...prev.specialGuests, { name: newGuestName.trim(), title: newGuestTitle.trim() }],
    }))
    setNewGuestName("")
    setNewGuestTitle("")
  }

  const addSupporter = () => {
    const member = memberOptions.find((option) => option.id === supporterMemberId)
    if (!member) return
    setFormData((prev) => ({
      ...prev,
      supporters: prev.supporters.some((item) => item.memberId === member.id)
        ? prev.supporters
        : [...prev.supporters, { memberId: member.id, name: member.name, role: supporterRole }],
    }))
    setSupporterMemberId("")
    setSupporterRole("supporter")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await onSave(formData, service)
      toast({
        title: service ? "Service updated" : "Service created",
        description: response.message,
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: service ? "Update failed" : "Creation failed",
        description: error instanceof Error ? error.message : "Unable to save service.",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>Manage services and events using the API endpoints.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["sunday_service","prayer_meeting","bible_study","special_event","conference","crusade","revival","seminar"].map((type) => (
                    <SelectItem key={type} value={type}>{type.replaceAll("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ServiceFormValues["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["scheduled","ongoing","completed","cancelled"].map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["Preacher", "preacherId"],
              ["Co-Preacher", "coPreacherId"],
              ["Chairman", "chairmanId"],
              ["Worship Leader", "worshipLeaderId"],
            ].map(([label, key]) => (
              <div className="space-y-2" key={key}>
                <Label>{label}</Label>
                <Select value={(formData as any)[key] || "__none__"} onValueChange={(value) => setFormData({ ...formData, [key]: value === "__none__" ? "" : value })}>
                  <SelectTrigger><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {memberOptions.map((member) => (
                      <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAttendance">Attendance</Label>
            <Input id="expectedAttendance" type="number" min="0" value={formData.expectedAttendance} onChange={(e) => setFormData({ ...formData, expectedAttendance: e.target.value })} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="isRecurring" checked={formData.isRecurring} onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked as boolean })} />
              <Label htmlFor="isRecurring">Recurring service</Label>
            </div>
            {formData.isRecurring && (
              <div className="space-y-3 rounded-lg border p-4">
                <Select value={formData.recurringType} onValueChange={(value) => setFormData({ ...formData, recurringType: value as ServiceFormValues["recurringType"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">weekly</SelectItem>
                    <SelectItem value="bi_weekly">bi weekly</SelectItem>
                    <SelectItem value="monthly">monthly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 gap-2">
                  {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => (
                    <label key={day} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={formData.recurringDays.includes(day)}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            recurringDays: checked ? [...prev.recurringDays, day] : prev.recurringDays.filter((item) => item !== day),
                          }))
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <Label>Supporters</Label>
            <div className="grid grid-cols-[1fr_180px_auto] gap-2">
              <Select value={supporterMemberId || "__none__"} onValueChange={(value) => setSupporterMemberId(value === "__none__" ? "" : value)}>
                <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select member</SelectItem>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={supporterRole} onValueChange={setSupporterRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["chairman","supporter","usher","setup_crew","hospitality","media"].map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSupporter}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.supporters.map((supporter) => (
                <Badge key={supporter.memberId} variant="secondary" className="flex items-center gap-1">
                  {supporter.name} ({supporter.role})
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFormData((prev) => ({
                    ...prev,
                    supporters: prev.supporters.filter((item) => item.memberId !== supporter.memberId),
                  }))} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <Label>Special Guests</Label>
            <div className="grid grid-cols-[180px_1fr_auto] gap-2">
              <Input value={newGuestTitle} onChange={(e) => setNewGuestTitle(e.target.value)} placeholder="Title" />
              <Input value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)} placeholder="Guest name" />
              <Button type="button" onClick={addGuest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialGuests.map((guest, index) => (
                <Badge key={`${guest.name}-${index}`} variant="outline" className="flex items-center gap-1">
                  {guest.title ? `${guest.title} ` : ""}{guest.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFormData((prev) => ({
                    ...prev,
                    specialGuests: prev.specialGuests.filter((_, guestIndex) => guestIndex !== index),
                  }))} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcementMessage">Announcement Message</Label>
            <Textarea id="announcementMessage" value={formData.announcementMessage} onChange={(e) => setFormData({ ...formData, announcementMessage: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : service ? "Update Service" : "Create Service"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
