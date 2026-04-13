"use client"

export interface GroupApiRecord {
  id: string
  name: string
  group_type: string
  description?: string | null
  leader_id: string
  co_leader_id?: string | null
  leader?: { id: string; first_name: string; last_name: string } | null
  co_leader?: { id: string; first_name: string; last_name: string } | null
  meeting_day?: string | null
  meeting_time?: string | null
  meeting_location?: string | null
  meeting_frequency?: string | null
  status: "active" | "inactive"
  photo_url?: string | null
  notes?: string | null
  group_members_count?: number
  group_members?: Array<{
    member_id: string
    role: "leader" | "member" | "observer"
    joined_date: string
    status: "active" | "inactive"
    member?: { id: string; first_name: string; last_name: string; phone?: string | null; email?: string | null } | null
  }>
}

export interface GroupFormValues {
  name: string
  description: string
  groupType: "ministry" | "committee" | "department"
  leaderId: string
  coLeaderId: string
  meetingDay: string
  meetingTime: string
  meetingLocation: string
  meetingFrequency: "weekly" | "bi_weekly" | "monthly"
  status: "active" | "inactive"
  notes: string
}

export interface GroupView extends GroupFormValues {
  id: string
  type: string
  leader: string
  coLeader: string
  memberCount: number
  meetingSchedule?: string
  members: Array<{
    id: string
    name: string
    role: "leader" | "member" | "observer"
    joinedDate: string
    status: "active" | "inactive"
    phone?: string | null
    email?: string | null
  }>
}

const memberName = (member?: { first_name: string; last_name: string } | null) =>
  member ? `${member.first_name} ${member.last_name}`.trim() : ""

export const emptyGroupFormValues = (): GroupFormValues => ({
  name: "",
  description: "",
  groupType: "ministry",
  leaderId: "",
  coLeaderId: "",
  meetingDay: "",
  meetingTime: "",
  meetingLocation: "",
  meetingFrequency: "weekly",
  status: "active",
  notes: "",
})

export const normalizeGroup = (group: GroupApiRecord): GroupView => ({
  id: group.id,
  name: group.name,
  description: group.description ?? "",
  groupType: group.group_type as GroupFormValues["groupType"],
  type: group.group_type,
  leaderId: group.leader?.id ?? group.leader_id,
  coLeaderId: group.co_leader?.id ?? group.co_leader_id ?? "",
  leader: memberName(group.leader),
  coLeader: memberName(group.co_leader),
  meetingDay: group.meeting_day ?? "",
  meetingTime: group.meeting_time ?? "",
  meetingLocation: group.meeting_location ?? "",
  meetingFrequency: (group.meeting_frequency as GroupFormValues["meetingFrequency"]) ?? "weekly",
  meetingSchedule: [group.meeting_day, group.meeting_time].filter(Boolean).join(" at "),
  status: group.status,
  notes: group.notes ?? "",
  memberCount: group.group_members_count ?? group.group_members?.length ?? 0,
  members: (group.group_members ?? []).map((membership) => ({
    id: membership.member_id,
    name: memberName(membership.member),
    role: membership.role,
    joinedDate: membership.joined_date,
    status: membership.status,
    phone: membership.member?.phone,
    email: membership.member?.email,
  })),
})

export const serializeGroupForm = (form: GroupFormValues) => ({
  name: form.name.trim(),
  description: form.description.trim() || null,
  group_type: form.groupType,
  leader_id: form.leaderId,
  co_leader_id: form.coLeaderId || null,
  meeting_day: form.meetingDay || null,
  meeting_time: form.meetingTime || null,
  meeting_location: form.meetingLocation.trim() || null,
  meeting_frequency: form.meetingDay ? form.meetingFrequency : null,
  status: form.status,
  notes: form.notes.trim() || null,
})
