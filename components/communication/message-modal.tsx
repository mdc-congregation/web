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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, User, X } from "lucide-react"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  message?: any
  event?: any
}

export function MessageModal({ isOpen, onClose, message, event }: MessageModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    type: "email",
    recipientType: "group",
    selectedGroups: [] as string[],
    selectedMembers: [] as string[],
    externalContacts: "",
    scheduledDate: "",
    scheduledTime: "",
    priority: "normal",
  })

  const [availableGroups] = useState([
    { id: "all_members", name: "All Members" },
    { id: "worship_team", name: "Worship Team" },
    { id: "youth_group", name: "Youth Group" },
    { id: "prayer_group", name: "Prayer Group" },
    { id: "finance_committee", name: "Finance Committee" },
  ])

  const [availableMembers] = useState([
    { id: "1", name: "John Smith", email: "john@example.com" },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com" },
    { id: "3", name: "Michael Chen", email: "michael@example.com" },
    { id: "4", name: "Emily Davis", email: "emily@example.com" },
  ])

  useEffect(() => {
    if (message) {
      setFormData({
        subject: message.subject || "",
        content: message.content || "",
        type: message.type || "email",
        recipientType: message.recipientType || "group",
        selectedGroups: message.selectedGroups || [],
        selectedMembers: message.selectedMembers || [],
        externalContacts: message.externalContacts || "",
        scheduledDate: message.scheduledDate || "",
        scheduledTime: message.scheduledTime || "",
        priority: message.priority || "normal",
      })
    } else {
      setFormData({
        subject: event ? `${event.title} - ` : "",
        content: event ? `${event.description}\n\n` : "",
        type: "email",
        recipientType: "group",
        selectedGroups: [],
        selectedMembers: [],
        externalContacts: "",
        scheduledDate: "",
        scheduledTime: "",
        priority: "normal",
      })
    }
  }, [message, event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Message submitted:", formData)
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

  const handleMemberToggle = (memberId: string) => {
    setFormData({
      ...formData,
      selectedMembers: formData.selectedMembers.includes(memberId)
        ? formData.selectedMembers.filter((id) => id !== memberId)
        : [...formData.selectedMembers, memberId],
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{message ? "Edit Message" : "Send Message"}</DialogTitle>
          <DialogDescription>
            {message ? "Update message details" : "Send email or SMS to members and external contacts"}
            {event && <span className="block mt-1 text-primary">Event: {event.title}</span>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <div className="min-h-[400px] mt-4">
              <TabsContent value="compose" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Message Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type === "email" && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Message subject"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Type your message here..."
                    rows={formData.type === "sms" ? 4 : 8}
                    required
                  />
                  {formData.type === "sms" && (
                    <p className="text-xs text-muted-foreground">Character count: {formData.content.length}/160</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Type</Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) => setFormData({ ...formData, recipientType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Groups</SelectItem>
                      <SelectItem value="individual">Individual Members</SelectItem>
                      <SelectItem value="external">External Contacts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.recipientType === "group" && (
                  <div className="space-y-3">
                    <Label>Select Groups</Label>
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
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {group.name}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedGroups.map((groupId) => {
                        const group = availableGroups.find((g) => g.id === groupId)
                        return (
                          <Badge key={groupId} variant="secondary" className="flex items-center gap-1">
                            {group?.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleGroupToggle(groupId)} />
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {formData.recipientType === "individual" && (
                  <div className="space-y-3">
                    <Label>Select Members</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={member.id}
                            checked={formData.selectedMembers.includes(member.id)}
                            onCheckedChange={() => handleMemberToggle(member.id)}
                          />
                          <label
                            htmlFor={member.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <div>{member.name}</div>
                                <div className="text-xs text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedMembers.map((memberId) => {
                        const member = availableMembers.find((m) => m.id === memberId)
                        return (
                          <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                            {member?.name}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleMemberToggle(memberId)} />
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {formData.recipientType === "external" && (
                  <div className="space-y-2">
                    <Label htmlFor="externalContacts">External Contacts</Label>
                    <Textarea
                      id="externalContacts"
                      value={formData.externalContacts}
                      onChange={(e) => setFormData({ ...formData, externalContacts: e.target.value })}
                      placeholder="Enter email addresses or phone numbers, separated by commas"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      For emails: john@example.com, jane@example.com
                      <br />
                      For SMS: +1234567890, +0987654321
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Options</Label>
                  <Select
                    value={formData.scheduledDate ? "later" : "now"}
                    onValueChange={(value) => {
                      if (value === "now") {
                        setFormData({ ...formData, scheduledDate: "", scheduledTime: "" })
                      } else {
                        setFormData({ ...formData, scheduledDate: new Date().toISOString().split("T")[0] })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="later">Send Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.scheduledDate && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Scheduled Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Message Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {formData.type.toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium">Recipients:</span>{" "}
                      {formData.recipientType === "group"
                        ? `${formData.selectedGroups.length} groups selected`
                        : formData.recipientType === "individual"
                          ? `${formData.selectedMembers.length} members selected`
                          : "External contacts"}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {formData.priority}
                    </div>
                    {formData.scheduledDate && (
                      <div>
                        <span className="font-medium">Scheduled:</span> {formData.scheduledDate} at{" "}
                        {formData.scheduledTime}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {message ? "Update Message" : formData.scheduledDate ? "Schedule Message" : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
