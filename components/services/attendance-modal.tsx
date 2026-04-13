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
import { useToast } from "@/hooks/use-toast"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: any
  onSave: (serviceId: string, attendance: number) => Promise<string>
  isSaving: boolean
}

export function AttendanceModal({ isOpen, onClose, service, onSave, isSaving }: AttendanceModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    actualAttendance: "",
  })

  useEffect(() => {
    if (service) {
      setFormData({
        actualAttendance: service.actualAttendance?.toString() || "",
      })
    } else {
      setFormData({
        actualAttendance: "",
      })
    }
  }, [service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return
    try {
      const message = await onSave(service.id, Number(formData.actualAttendance))
      toast({
        title: "Attendance updated",
        description: message,
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unable to record attendance.",
      })
    }
  }

  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Attendance</DialogTitle>
          <DialogDescription>Record the actual attendance for this service</DialogDescription>
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
              <div>
                <span className="font-medium">Expected:</span> {service.expectedAttendance} attendees
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actualAttendance">Actual Attendance</Label>
              <Input
                id="actualAttendance"
                type="number"
                value={formData.actualAttendance}
                onChange={(e) => setFormData({ ...formData, actualAttendance: e.target.value })}
                placeholder="Enter actual number of attendees"
                min="0"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Record Attendance"}</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
