"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { emptyGroupFormValues, type GroupFormValues, type GroupView } from "@/utils/groups"
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

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  group?: GroupView | null
  memberOptions: Array<{ id: string; name: string; phone?: string | null }>
  onSave: (formData: GroupFormValues, existingGroup?: GroupView | null) => Promise<{ message: string }>
  isSaving: boolean
}

export function GroupModal({ isOpen, onClose, group, memberOptions, onSave, isSaving }: GroupModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<GroupFormValues>(emptyGroupFormValues())

  useEffect(() => {
    setFormData(group ? { ...emptyGroupFormValues(), ...group } : emptyGroupFormValues())
  }, [group, isOpen])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await onSave(formData, group)
      toast({
        title: group ? "Group updated" : "Group created",
        description: response.message,
      })
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: group ? "Update failed" : "Creation failed",
        description: error instanceof Error ? error.message : "Unable to save group.",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Add Group"}</DialogTitle>
          <DialogDescription>Manage group details through the API.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupType">Group Type</Label>
              <Select
                value={formData.groupType}
                onValueChange={(value) => setFormData({ ...formData, groupType: value as GroupFormValues["groupType"] })}
              >
                <SelectTrigger id="groupType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ministry">Ministry</SelectItem>
                  <SelectItem value="committee">Committee</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Leader</Label>
              <Select
                value={formData.leaderId || "__none__"}
                onValueChange={(value) => setFormData({ ...formData, leaderId: value === "__none__" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select leader</SelectItem>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Co-Leader</Label>
              <Select
                value={formData.coLeaderId || "__none__"}
                onValueChange={(value) => setFormData({ ...formData, coLeaderId: value === "__none__" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select co-leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingDay">Meeting Day</Label>
              <Select
                value={formData.meetingDay || "__none__"}
                onValueChange={(value) => setFormData({ ...formData, meetingDay: value === "__none__" ? "" : value })}
              >
                <SelectTrigger id="meetingDay">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Not set</SelectItem>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input
                id="meetingTime"
                type="time"
                value={formData.meetingTime}
                onChange={(event) => setFormData({ ...formData, meetingTime: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingFrequency">Frequency</Label>
              <Select
                value={formData.meetingDay ? formData.meetingFrequency : "__none__"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    meetingFrequency: value === "__none__" ? "weekly" : (value as GroupFormValues["meetingFrequency"]),
                  })
                }
              >
                <SelectTrigger id="meetingFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Not set</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingLocation">Meeting Location</Label>
              <Input
                id="meetingLocation"
                value={formData.meetingLocation}
                onChange={(event) => setFormData({ ...formData, meetingLocation: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as GroupFormValues["status"] })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : group ? "Update Group" : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
