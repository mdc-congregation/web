"use client"

import { useEffect, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { GroupView } from "@/utils/groups"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Check, ChevronsUpDown, Clock, MapPin, Trash2, UserPlus, Users } from "lucide-react"

interface GroupDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  group?: GroupView | null
  memberOptions: Array<{ id: string; name: string; phone?: string | null }>
  onRefresh: (groupId: string) => Promise<GroupView>
  onAddMember: (groupId: string, payload: { member_id: string; role: string; joined_date: string; status: string }) => Promise<{ group: GroupView; message: string }>
  onRemoveMember: (groupId: string, memberId: string) => Promise<string>
  onUpdateMemberRole: (groupId: string, memberId: string, role: "leader" | "member" | "observer") => Promise<{ group: GroupView; message: string }>
  onDeleteGroup: (groupId: string) => Promise<string>
  isSaving: boolean
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "ministry":
      return "Ministry"
    case "committee":
      return "Committee"
    case "department":
      return "Department"
    default:
      return type
  }
}

export function GroupDetailsModal({
  isOpen,
  onClose,
  group,
  memberOptions,
  onRefresh,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onDeleteGroup,
  isSaving,
}: GroupDetailsModalProps) {
  const { toast } = useToast()
  const [liveGroup, setLiveGroup] = useState<GroupView | null>(group ?? null)
  const [memberId, setMemberId] = useState("")
  const [memberRole, setMemberRole] = useState<"leader" | "member" | "observer">("member")
  const [joinedDate, setJoinedDate] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [memberPickerOpen, setMemberPickerOpen] = useState(false)

  useEffect(() => {
    setLiveGroup(group ?? null)
  }, [group])

  useEffect(() => {
    if (!isOpen || !group?.id) {
      return
    }

    void onRefresh(group.id)
      .then(setLiveGroup)
      .catch(() => {})
  }, [group?.id, isOpen, onRefresh])

  const availableMembers = useMemo(() => {
    const assignedIds = new Set(liveGroup?.members.map((member) => member.id) ?? [])
    return memberOptions.filter((member) => !assignedIds.has(member.id))
  }, [liveGroup?.members, memberOptions])

  const selectedMember = useMemo(
    () => availableMembers.find((member) => member.id === memberId) ?? null,
    [availableMembers, memberId],
  )

  const handleAddMember = async () => {
    if (!liveGroup || !memberId || !joinedDate) {
      return
    }

    try {
      const response = await onAddMember(liveGroup.id, {
        member_id: memberId,
        role: memberRole,
        joined_date: joinedDate,
        status: "active",
      })
      setLiveGroup(response.group)
      setMemberId("")
      setMemberPickerOpen(false)
      setMemberRole("member")
      setJoinedDate("")
      toast({
        title: "Member added",
        description: response.message,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Add failed",
        description: error instanceof Error ? error.message : "Unable to add member.",
      })
    }
  }

  const handleRoleChange = async (memberIdToUpdate: string, role: "leader" | "member" | "observer") => {
    if (!liveGroup) {
      return
    }

    try {
      const response = await onUpdateMemberRole(liveGroup.id, memberIdToUpdate, role)
      setLiveGroup(response.group)
      toast({
        title: "Role updated",
        description: response.message,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unable to update member role.",
      })
    }
  }

  const handleRemoveMember = async (memberIdToRemove: string) => {
    if (!liveGroup) {
      return
    }

    try {
      const message = await onRemoveMember(liveGroup.id, memberIdToRemove)
      const refreshed = await onRefresh(liveGroup.id)
      setLiveGroup(refreshed)
      toast({
        title: "Member removed",
        description: message,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Removal failed",
        description: error instanceof Error ? error.message : "Unable to remove member.",
      })
    }
  }

  const handleDeleteGroup = async () => {
    if (!liveGroup) {
      return
    }

    try {
      const message = await onDeleteGroup(liveGroup.id)
      toast({
        title: "Group deleted",
        description: message,
      })
      setDeleteConfirmOpen(false)
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete group.",
      })
    }
  }

  if (!liveGroup) {
    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {liveGroup.name}
            </DialogTitle>
            <DialogDescription>{liveGroup.description || "Manage members and group details."}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getTypeLabel(liveGroup.type)}</Badge>
                    <Badge variant={liveGroup.status === "active" ? "default" : "secondary"}>{liveGroup.status}</Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Leader:</span> {liveGroup.leader || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Co-Leader:</span> {liveGroup.coLeader || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{liveGroup.meetingDay || "No meeting day set"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{liveGroup.meetingTime || "No meeting time set"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{liveGroup.meetingLocation || "No meeting location set"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span> {liveGroup.meetingFrequency || "-"}
                    </div>
                  </div>

                  {liveGroup.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="font-medium">Notes</p>
                        <p className="mt-1 text-sm text-muted-foreground">{liveGroup.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Member</CardTitle>
                  <CardDescription>Link a member to this group through the API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Member</Label>
                    <Popover open={memberPickerOpen} onOpenChange={setMemberPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={memberPickerOpen}
                          className="w-full justify-between font-normal"
                        >
                          <span className="truncate">
                            {selectedMember ? `${selectedMember.name}${selectedMember.phone ? ` • ${selectedMember.phone}` : ""}` : "Search and select member"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search members..." />
                          <CommandList>
                            <CommandEmpty>No available members found.</CommandEmpty>
                            <CommandGroup>
                              {availableMembers.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={`${member.name} ${member.phone ?? ""}`}
                                  onSelect={() => {
                                    setMemberId(member.id)
                                    setMemberPickerOpen(false)
                                  }}
                                >
                                  <Check className={`mr-2 h-4 w-4 ${memberId === member.id ? "opacity-100" : "opacity-0"}`} />
                                  <div className="flex min-w-0 flex-col">
                                    <span className="truncate">{member.name}</span>
                                    {member.phone && <span className="text-xs text-muted-foreground">{member.phone}</span>}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={memberRole} onValueChange={(value) => setMemberRole(value as "leader" | "member" | "observer")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leader">Leader</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="observer">Observer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinedDate">Joined Date</Label>
                      <Input id="joinedDate" type="date" value={joinedDate} onChange={(event) => setJoinedDate(event.target.value)} />
                    </div>
                  </div>

                  <Button onClick={() => void handleAddMember()} disabled={isSaving || !memberId || !joinedDate} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Add Member"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>{liveGroup.members.length} linked members</CardDescription>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)} disabled={isSaving}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Group
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liveGroup.members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members linked to this group yet.</p>
                  ) : (
                    liveGroup.members.map((member) => (
                      <div key={member.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.phone || "No phone number"}</p>
                            <p className="text-xs text-muted-foreground">Joined {member.joinedDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={member.role}
                              onValueChange={(value) => void handleRoleChange(member.id, value as "leader" | "member" | "observer")}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="leader">Leader</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="observer">Observer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" onClick={() => void handleRemoveMember(member.id)} disabled={isSaving}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium text-foreground">{liveGroup.name}</span>. This will remove the group record from the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDeleteGroup()} disabled={isSaving}>
              {isSaving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
