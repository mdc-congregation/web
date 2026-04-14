"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
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
import { Calendar, Cake, Loader2, MessageSquare, Search, Users, X } from "lucide-react"
import type {
  CommunicationEvent,
  CommunicationMessagePayload,
  CommunicationRecipientOptions,
  CommunicationTemplate,
} from "@/hooks/use-communication"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  event?: CommunicationEvent | null
  recipients: CommunicationRecipientOptions
  templates: CommunicationTemplate[]
  isSaving: boolean
  loadRecipients: (options?: { includeGuests?: boolean; weekOffset?: number }) => Promise<CommunicationRecipientOptions>
  onSend: (payload: CommunicationMessagePayload) => Promise<void>
}

const emptyRecipients: CommunicationRecipientOptions = {
  members: [],
  groups: [],
  birthdayCelebrants: [],
}

export function MessageModal({
  isOpen,
  onClose,
  event,
  recipients,
  templates,
  isSaving,
  loadRecipients,
  onSend,
}: MessageModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    recipientType: "groups" as CommunicationMessagePayload["recipient_scope"],
    selectedGroups: [] as string[],
    selectedMembers: [] as string[],
    includeGuests: false,
    personalized: false,
    birthdayWeekOffset: "0",
    templateName: "",
  })
  const [memberSearch, setMemberSearch] = useState("")
  const [groupSearch, setGroupSearch] = useState("")
  const [availableRecipients, setAvailableRecipients] = useState<CommunicationRecipientOptions>(recipients)
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormData({
      subject: event?.title ?? "",
      content: event?.description ?? "",
      recipientType: event?.type === "birthday" ? "birthday_celebrants" : "groups",
      selectedGroups: [],
      selectedMembers: [],
      includeGuests: false,
      personalized: event?.type === "birthday",
      birthdayWeekOffset: "0",
      templateName: event?.type === "birthday" ? "birthday_wish" : "",
    })
    setMemberSearch("")
    setGroupSearch("")
    setAvailableRecipients(recipients)
  }, [event, isOpen, recipients])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let cancelled = false

    const fetchRecipients = async () => {
      try {
        setIsLoadingRecipients(true)
        const nextRecipients = await loadRecipients({
          includeGuests: formData.includeGuests,
          weekOffset: Number(formData.birthdayWeekOffset),
        })

        if (!cancelled) {
          setAvailableRecipients(nextRecipients)
        }
      } catch {
        if (!cancelled) {
          setAvailableRecipients(emptyRecipients)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRecipients(false)
        }
      }
    }

    void fetchRecipients()

    return () => {
      cancelled = true
    }
  }, [formData.birthdayWeekOffset, formData.includeGuests, isOpen, loadRecipients])

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.name === formData.templateName),
    [formData.templateName, templates],
  )

  const filteredMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase()

    if (!query) {
      return availableRecipients.members
    }

    return availableRecipients.members.filter(
      (member) => member.name.toLowerCase().includes(query) || member.phone.toLowerCase().includes(query),
    )
  }, [availableRecipients.members, memberSearch])

  const filteredGroups = useMemo(() => {
    const query = groupSearch.trim().toLowerCase()

    if (!query) {
      return availableRecipients.groups
    }

    return availableRecipients.groups.filter(
      (group) => group.name.toLowerCase().includes(query) || group.type.toLowerCase().includes(query),
    )
  }, [availableRecipients.groups, groupSearch])

  const recipientCount = useMemo(() => {
    switch (formData.recipientType) {
      case "members":
        return formData.selectedMembers.length
      case "groups":
        return availableRecipients.groups
          .filter((group) => formData.selectedGroups.includes(group.id))
          .reduce((total, group) => total + group.memberCount, 0)
      case "all_members":
        return availableRecipients.members.length
      case "birthday_celebrants":
        return formData.selectedMembers.length > 0 ? formData.selectedMembers.length : availableRecipients.birthdayCelebrants.length
      default:
        return 0
    }
  }, [availableRecipients, formData.recipientType, formData.selectedGroups, formData.selectedMembers])

  const canSend =
    formData.content.trim().length > 0 &&
    (formData.recipientType !== "members" || formData.selectedMembers.length > 0) &&
    (formData.recipientType !== "groups" || formData.selectedGroups.length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSend) {
      return
    }

    await onSend({
      communication_event_id: event?.id,
      subject: formData.subject.trim() || undefined,
      content: formData.content.trim(),
      recipient_scope: formData.recipientType,
      member_ids:
        formData.recipientType === "members" || (formData.recipientType === "birthday_celebrants" && formData.selectedMembers.length > 0)
          ? formData.selectedMembers
          : undefined,
      group_ids: formData.recipientType === "groups" ? formData.selectedGroups : undefined,
      include_guests: formData.includeGuests,
      personalized: formData.personalized,
      birthday_week_offset: formData.recipientType === "birthday_celebrants" ? Number(formData.birthdayWeekOffset) : undefined,
    })
  }

  const handleGroupToggle = (groupId: string) => {
    setFormData((current) => ({
      ...current,
      selectedGroups: current.selectedGroups.includes(groupId)
        ? current.selectedGroups.filter((id) => id !== groupId)
        : [...current.selectedGroups, groupId],
    }))
  }

  const handleMemberToggle = (memberId: string) => {
    setFormData((current) => ({
      ...current,
      selectedMembers: current.selectedMembers.includes(memberId)
        ? current.selectedMembers.filter((id) => id !== memberId)
        : [...current.selectedMembers, memberId],
    }))
  }

  const handleSelectAllCelebrants = () => {
    setFormData((current) => ({
      ...current,
      selectedMembers: availableRecipients.birthdayCelebrants.map((member) => member.id),
    }))
  }

  const handleClearSelectedCelebrants = () => {
    setFormData((current) => ({
      ...current,
      selectedMembers: [],
    }))
  }

  const applyTemplate = (templateName: string) => {
    const template = templates.find((item) => item.name === templateName)
    setFormData((current) => ({
      ...current,
      templateName,
      content: template?.content ?? current.content,
      personalized: templateName === "birthday_wish" ? true : current.personalized,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogDescription>
            Send SMS to selected members, ministries, departments, committees, all members, or birthday celebrants.
            {event && <span className="mt-1 block text-primary">Event: {event.title}</span>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            <div className="mt-4 min-h-[420px]">
              <TabsContent value="compose" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Label</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((current) => ({ ...current, subject: e.target.value }))}
                    placeholder="Internal label for this SMS"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={formData.templateName || "__none__"} onValueChange={(value) => applyTemplate(value === "__none__" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No template</SelectItem>
                      {templates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <p className="text-xs text-muted-foreground">
                      Use <code>{"{{name}}"}</code> to personalize each SMS.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">SMS Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData((current) => ({ ...current, content: e.target.value }))}
                    placeholder="Type your SMS here..."
                    rows={6}
                    required
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Character count: {formData.content.length}/1000</span>
                    <span>{recipientCount} targeted recipients</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Type</Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) =>
                      setFormData((current) => ({
                        ...current,
                        recipientType: value as CommunicationMessagePayload["recipient_scope"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groups">Ministries, Departments & Committees</SelectItem>
                      <SelectItem value="members">Individual Members</SelectItem>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="birthday_celebrants">Birthday Celebrants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.recipientType === "groups" && (
                  <div className="space-y-3">
                    <Label>Select Groups</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                        placeholder="Search ministries, departments, committees..."
                        className="pl-9"
                      />
                    </div>
                    <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border p-3">
                      {filteredGroups.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No matching groups found.</p>
                      ) : (
                        filteredGroups.map((group) => (
                          <label key={group.id} className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
                            <Checkbox
                              checked={formData.selectedGroups.includes(group.id)}
                              onCheckedChange={() => handleGroupToggle(group.id)}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="font-medium">{group.name}</div>
                              <div className="text-muted-foreground">
                                {group.type} • {group.memberCount} members
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {formData.recipientType === "members" && (
                  <div className="space-y-3">
                    <Label>Select Members</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Search members by name or phone..."
                        className="pl-9"
                      />
                    </div>
                    <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border p-3">
                      {filteredMembers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No matching members found.</p>
                      ) : (
                        filteredMembers.map((member) => (
                          <label key={member.id} className="flex cursor-pointer items-start gap-3 rounded-md border p-3">
                            <Checkbox
                              checked={formData.selectedMembers.includes(member.id)}
                              onCheckedChange={() => handleMemberToggle(member.id)}
                            />
                            <div className="space-y-1 text-sm">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-muted-foreground">{member.phone || "No phone number on file"}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {formData.recipientType === "all_members" && (
                  <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                    This SMS will go to all members with phone numbers on file.
                  </div>
                )}

                {formData.recipientType === "birthday_celebrants" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Birthday Week</Label>
                      <Select
                        value={formData.birthdayWeekOffset}
                        onValueChange={(value) => setFormData((current) => ({ ...current, birthdayWeekOffset: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">Previous Week</SelectItem>
                          <SelectItem value="0">Current Week</SelectItem>
                          <SelectItem value="1">Next Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {availableRecipients.birthdayCelebrants.length} celebrants available for this week
                      {formData.selectedMembers.length > 0 ? ` • ${formData.selectedMembers.length} selected` : " • all will be sent if none are selected"}
                    </div>
                    {availableRecipients.birthdayCelebrants.length > 0 && (
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={handleSelectAllCelebrants}>
                          Select all
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleClearSelectedCelebrants}>
                          Clear selection
                        </Button>
                      </div>
                    )}
                    <div className="rounded-lg border p-3">
                      {isLoadingRecipients ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading celebrants...
                        </div>
                      ) : availableRecipients.birthdayCelebrants.length === 0 ? (
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>No birthday celebrants found for this week.</p>
                          {!formData.includeGuests && <p>Try enabling guests in Options if celebrants include visitors or guests.</p>}
                        </div>
                      ) : (
                        <div className="max-h-56 space-y-2 overflow-y-auto">
                          {availableRecipients.birthdayCelebrants.map((member) => (
                            <label key={member.id} className="flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={formData.selectedMembers.includes(member.id)}
                                  onCheckedChange={() => handleMemberToggle(member.id)}
                                />
                                <Cake className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-muted-foreground">{member.phone || "No phone number on file"}</div>
                                </div>
                              </div>
                              <div className="text-right text-muted-foreground">
                                <div>{member.birthdayDay}</div>
                                <div>{member.birthdayDate}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.recipientType === "groups" && formData.selectedGroups.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedGroups.map((groupId) => {
                      const group = availableRecipients.groups.find((item) => item.id === groupId)

                      return (
                        <Badge key={groupId} variant="secondary" className="flex items-center gap-1">
                          {group?.name ?? "Selected group"}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleGroupToggle(groupId)} />
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {formData.recipientType === "members" && formData.selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedMembers.map((memberId) => {
                      const member = availableRecipients.members.find((item) => item.id === memberId)

                      return (
                        <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                          {member?.name ?? "Selected member"}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleMemberToggle(memberId)} />
                        </Badge>
                      )
                    })}
                  </div>
                )}

                {formData.recipientType === "birthday_celebrants" && formData.selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedMembers.map((memberId) => {
                      const member = availableRecipients.birthdayCelebrants.find((item) => item.id === memberId)

                      return (
                        <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                          {member?.name ?? "Selected celebrant"}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleMemberToggle(memberId)} />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="options" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeGuests"
                    checked={formData.includeGuests}
                    onCheckedChange={(checked) => setFormData((current) => ({ ...current, includeGuests: Boolean(checked) }))}
                  />
                  <Label htmlFor="includeGuests">Include guests and visitors where applicable</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personalized"
                    checked={formData.personalized}
                    onCheckedChange={(checked) => setFormData((current) => ({ ...current, personalized: Boolean(checked) }))}
                  />
                  <Label htmlFor="personalized">
                    Personalize the message with <code>{"{{name}}"}</code>
                  </Label>
                </div>

                <div className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS only
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Groups cover ministries, departments, and committees
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Birthday messages can use one template and still address each celebrant by name
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isLoadingRecipients || !canSend}>
              {isSaving ? "Sending..." : "Send SMS"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
