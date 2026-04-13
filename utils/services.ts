"use client"

import { format } from "date-fns"

export interface ServiceApiRecord {
  id: string
  title: string
  service_type: string
  start_date: string | null
  end_date: string | null
  start_time: string
  end_time: string
  location?: string | null
  preacher_id?: string | null
  co_preacher_id?: string | null
  chairman_id?: string | null
  worship_leader_id?: string | null
  preacher?: { id: string; first_name: string; last_name: string } | null
  co_preacher?: { id: string; first_name: string; last_name: string } | null
  chairman?: { id: string; first_name: string; last_name: string } | null
  worship_leader?: { id: string; first_name: string; last_name: string } | null
  supporters?: Array<{
    member_id: string
    role: string
    member?: { id: string; first_name: string; last_name: string; phone?: string | null } | null
  }>
  special_guests?: Array<{ name: string; title?: string | null }> | null
  attendance?: number | null
  announcement_message?: string | null
  is_recurring?: boolean
  day_of_week?: string[] | null
  recurrence_pattern?: string | null
  recurrence_end_date?: string | null
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  notes?: string | null
}

export interface ServiceFormValues {
  title: string
  serviceType: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  preacherId: string
  coPreacherId: string
  chairmanId: string
  worshipLeaderId: string
  expectedAttendance: string
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  description: string
  notes: string
  announcementMessage: string
  isRecurring: boolean
  recurringType: "none" | "weekly" | "bi_weekly" | "monthly"
  recurringDays: string[]
  specialGuests: Array<{ name: string; title: string }>
  supporters: Array<{ memberId: string; name: string; role: string }>
}

export interface ServiceView extends ServiceFormValues {
  id: string
  type: string
  date: string
  time: string
  preacher: string
  chairman: string
  coPreacher: string
  worshipLeader: string
  specialGuestNames: string[]
  actualAttendance?: number
}

const memberName = (member?: { first_name: string; last_name: string } | null) =>
  member ? `${member.first_name} ${member.last_name}`.trim() : ""

const normalizeIsoDate = (value?: string | null) => {
  if (!value) {
    return ""
  }

  const normalized = value.includes("T") ? value.slice(0, 10) : value
  return normalized
}

const formatServiceDate = (value?: string | null) => {
  const normalized = normalizeIsoDate(value)
  if (!normalized) {
    return ""
  }

  const date = new Date(`${normalized}T00:00:00`)
  return Number.isNaN(date.getTime()) ? normalized : format(date, "EEEE, MMM d, yyyy")
}

const formatServiceTime = (value?: string | null) => {
  if (!value) {
    return ""
  }

  const normalized = value.length >= 5 ? value.slice(0, 5) : value
  const date = new Date(`1970-01-01T${normalized}:00`)
  return Number.isNaN(date.getTime()) ? normalized : format(date, "h:mm a")
}

export const emptyServiceFormValues = (): ServiceFormValues => ({
  title: "",
  serviceType: "sunday_service",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
  preacherId: "",
  coPreacherId: "",
  chairmanId: "",
  worshipLeaderId: "",
  expectedAttendance: "",
  status: "scheduled",
  description: "",
  notes: "",
  announcementMessage: "",
  isRecurring: false,
  recurringType: "weekly",
  recurringDays: [],
  specialGuests: [],
  supporters: [],
})

export const normalizeService = (service: ServiceApiRecord): ServiceView => ({
  id: service.id,
  title: service.title,
  serviceType: service.service_type,
  type: service.service_type,
  startDate: normalizeIsoDate(service.start_date),
  endDate: normalizeIsoDate(service.end_date),
  date: formatServiceDate(service.start_date),
  startTime: service.start_time,
  endTime: service.end_time,
  time:
    service.start_time && service.end_time
      ? `${formatServiceTime(service.start_time)} - ${formatServiceTime(service.end_time)}`
      : formatServiceTime(service.start_time),
  location: service.location ?? "",
  preacherId: service.preacher?.id ?? service.preacher_id ?? "",
  coPreacherId: service.co_preacher?.id ?? service.co_preacher_id ?? "",
  chairmanId: service.chairman?.id ?? service.chairman_id ?? "",
  worshipLeaderId: service.worship_leader?.id ?? service.worship_leader_id ?? "",
  preacher: memberName(service.preacher),
  coPreacher: memberName(service.co_preacher),
  chairman: memberName(service.chairman),
  worshipLeader: memberName(service.worship_leader),
  expectedAttendance: service.attendance?.toString() ?? "",
  actualAttendance: service.attendance ?? undefined,
  status: service.status,
  description: "",
  notes: service.notes ?? "",
  announcementMessage: service.announcement_message ?? "",
  isRecurring: Boolean(service.is_recurring),
  recurringType: (service.recurrence_pattern as ServiceFormValues["recurringType"]) || "weekly",
  recurringDays: service.day_of_week ?? [],
  specialGuests: (service.special_guests ?? []).map((guest) => ({
    name: guest.name,
    title: guest.title ?? "",
  })),
  specialGuestNames: (service.special_guests ?? []).map((guest) =>
    guest.title ? `${guest.title} ${guest.name}` : guest.name,
  ),
  supporters: (service.supporters ?? []).map((supporter) => ({
    memberId: supporter.member_id,
    name: memberName(supporter.member),
    role: supporter.role,
  })),
})

export const serializeServiceForm = (form: ServiceFormValues) => ({
  title: form.title.trim(),
  service_type: form.serviceType,
  start_date: form.startDate || null,
  end_date: form.endDate || null,
  start_time: form.startTime,
  end_time: form.endTime,
  location: form.location.trim() || null,
  preacher_id: form.preacherId || null,
  co_preacher_id: form.coPreacherId || null,
  chairman_id: form.chairmanId || null,
  worship_leader_id: form.worshipLeaderId || null,
  special_guests: form.specialGuests
    .filter((guest) => guest.name.trim())
    .map((guest) => ({
      name: guest.name.trim(),
      title: guest.title.trim() || null,
    })),
  attendance: form.expectedAttendance ? Number(form.expectedAttendance) : null,
  announcement_message: form.announcementMessage.trim() || null,
  is_recurring: form.isRecurring,
  day_of_week: form.isRecurring ? form.recurringDays : [],
  recurrence_pattern: form.isRecurring ? form.recurringType : "none",
  recurrence_end_date: null,
  status: form.status,
  notes: form.notes.trim() || null,
})
