"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type PaginatedResponse<T> = {
  current_page: number
  data: T[]
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

type CommunicationStatsPayload = {
  messages_sent: {
    count: number
    this_week: number
  }
  sms_credits: {
    balance: number | null
    available: boolean
  }
  active_events: {
    count: number
  }
  total_recipients: {
    count: number
  }
  birthday_celebrants: {
    count: number
  }
}

type CommunicationEventRecord = {
  id: string
  title: string
  description?: string | null
  type: "announcement" | "reminder" | "invitation" | "birthday"
  status: "draft" | "active" | "completed"
  notes?: string | null
  created_at: string
  messages_count?: number
  messages_sum_recipient_count?: number | null
  messages?: CommunicationMessageRecord[]
}

type CommunicationMessageRecord = {
  id: string
  communication_event_id?: string | null
  subject?: string | null
  content: string
  channel: "sms"
  recipient_scope: "members" | "groups" | "all_members" | "birthday_celebrants"
  recipient_count: number
  success_count: number
  failed_count: number
  status: "draft" | "pending" | "sent" | "partial" | "failed"
  personalized: boolean
  include_guests: boolean
  filters?: {
    member_ids?: string[]
    group_ids?: string[]
    birthday_week_offset?: number
  } | null
  scheduled_for?: string | null
  sent_at?: string | null
  created_at: string
  event?: {
    id: string
    title: string
  } | null
}

type RecipientPayload = {
  members: Array<{
    id: string
    first_name: string
    last_name: string
    phone: string
    membership_status?: string | null
    account_type?: string | null
  }>
  groups: Array<{
    id: string
    name: string
    group_type: string
    group_members_count: number
  }>
  birthday_celebrants: Array<{
    id: string
    name: string
    phone: string
    birthday_date: string
    birthday_day: string
  }>
}

type TemplatePayload = Array<{
  name: string
  label: string
  content: string
}>

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
})

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return dateFormatter.format(date)
}

const formatShortDate = (value?: string | null) => {
  if (!value) {
    return "-"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return shortDateFormatter.format(date)
}

const formatScopeLabel = (scope: CommunicationMessage["recipientType"]) => {
  switch (scope) {
    case "members":
      return "Individual Members"
    case "groups":
      return "Groups, Departments & Committees"
    case "all_members":
      return "All Members"
    case "birthday_celebrants":
      return "Birthday Celebrants"
    default:
      return scope
  }
}

const formatGroupType = (value: string) =>
  value
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")

export type CommunicationEvent = {
  id: string
  title: string
  description: string
  createdDate: string
  createdDateLabel: string
  status: "draft" | "active" | "completed"
  messagesSent: number
  totalRecipients: number
  type: "announcement" | "reminder" | "invitation" | "birthday"
  typeLabel: string
  notes: string
}

export type CommunicationMessage = {
  id: string
  subject: string
  content: string
  type: "sms"
  recipientType: "members" | "groups" | "all_members" | "birthday_celebrants"
  recipientTypeLabel: string
  recipientCount: number
  successCount: number
  failedCount: number
  sentDate: string
  sentDateLabel: string
  status: "draft" | "pending" | "sent" | "partial" | "failed"
  personalized: boolean
  includeGuests: boolean
  scheduledFor?: string | null
  scheduledForLabel?: string
  eventTitle?: string
}

export type CommunicationEventDetails = CommunicationEvent & {
  messages: CommunicationMessage[]
}

export type CommunicationRecipientOptions = {
  members: Array<{ id: string; name: string; phone: string; status?: string | null; accountType?: string | null }>
  groups: Array<{ id: string; name: string; type: string; memberCount: number }>
  birthdayCelebrants: Array<{ id: string; name: string; phone: string; birthdayDate: string; birthdayDay: string }>
}

export type CommunicationTemplate = {
  name: string
  label: string
  content: string
}

export type CommunicationEventPayload = {
  title: string
  description: string
  type: "announcement" | "reminder" | "invitation" | "birthday"
  status: "draft" | "active" | "completed"
  notes: string
}

export type CommunicationMessagePayload = {
  communication_event_id?: string
  subject?: string
  content: string
  recipient_scope: "members" | "groups" | "all_members" | "birthday_celebrants"
  member_ids?: string[]
  group_ids?: string[]
  include_guests?: boolean
  personalized?: boolean
  birthday_week_offset?: number
}

const normalizeMessage = (message: CommunicationMessageRecord): CommunicationMessage => ({
  id: message.id,
  subject: message.subject || message.content.slice(0, 60),
  content: message.content,
  type: "sms",
  recipientType: message.recipient_scope,
  recipientTypeLabel: formatScopeLabel(message.recipient_scope),
  recipientCount: message.recipient_count,
  successCount: message.success_count,
  failedCount: message.failed_count,
  sentDate: message.sent_at || message.scheduled_for || message.created_at,
  sentDateLabel: formatDate(message.sent_at || message.scheduled_for || message.created_at),
  status: message.status,
  personalized: message.personalized,
  includeGuests: message.include_guests,
  scheduledFor: message.scheduled_for ?? null,
  scheduledForLabel: formatDate(message.scheduled_for),
  eventTitle: message.event?.title,
})

const normalizeEvent = (event: CommunicationEventRecord): CommunicationEvent => ({
  id: event.id,
  title: event.title,
  description: event.description ?? "",
  createdDate: event.created_at,
  createdDateLabel: formatDate(event.created_at),
  status: event.status,
  messagesSent: event.messages_count ?? 0,
  totalRecipients: event.messages_sum_recipient_count ?? 0,
  type: event.type,
  typeLabel: formatGroupType(event.type),
  notes: event.notes ?? "",
})

const normalizeRecipients = (payload: RecipientPayload): CommunicationRecipientOptions => ({
  members: payload.members.map((member) => ({
    id: member.id,
    name: `${member.first_name} ${member.last_name}`.trim(),
    phone: member.phone,
    status: member.membership_status,
    accountType: member.account_type,
  })),
  groups: payload.groups.map((group) => ({
    id: group.id,
    name: group.name,
    type: formatGroupType(group.group_type),
    memberCount: group.group_members_count,
  })),
  birthdayCelebrants: payload.birthday_celebrants.map((member) => ({
    id: member.id,
    name: member.name,
    phone: member.phone,
    birthdayDate: formatShortDate(member.birthday_date),
    birthdayDay: member.birthday_day,
  })),
})

const emptyRecipients: CommunicationRecipientOptions = {
  members: [],
  groups: [],
  birthdayCelebrants: [],
}

export function useCommunication(searchTerm: string) {
  const [events, setEvents] = useState<CommunicationEvent[]>([])
  const [messages, setMessages] = useState<CommunicationMessage[]>([])
  const [stats, setStats] = useState<CommunicationStatsPayload | null>(null)
  const [recipients, setRecipients] = useState<CommunicationRecipientOptions>(emptyRecipients)
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecipients = useCallback(async (options?: { includeGuests?: boolean; weekOffset?: number }) => {
    const params: Record<string, string> = {
      include_guests: options?.includeGuests ? "true" : "false",
      week_offset: String(options?.weekOffset ?? 0),
    }
    const response = (await api.communication.getRecipients(params)) as ApiResponse<RecipientPayload>

    return normalizeRecipients(response.data)
  }, [])

  const fetchCommunicationData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: Record<string, string> = searchTerm.trim()
        ? { search: searchTerm.trim(), per_page: "100" }
        : { per_page: "100" }

      const [eventsResponse, messagesResponse, statsResponse, recipientsResponse, templatesResponse] = await Promise.all([
        api.communication.getEvents(params) as Promise<ApiResponse<PaginatedResponse<CommunicationEventRecord>>>,
        api.communication.getMessages(params) as Promise<ApiResponse<PaginatedResponse<CommunicationMessageRecord>>>,
        api.communication.getStats() as Promise<ApiResponse<CommunicationStatsPayload>>,
        api.communication.getRecipients({ include_guests: "false", week_offset: "0" }) as Promise<ApiResponse<RecipientPayload>>,
        api.communication.getTemplates() as Promise<ApiResponse<TemplatePayload>>,
      ])

      setEvents(eventsResponse.data.data.map(normalizeEvent))
      setMessages(messagesResponse.data.data.map(normalizeMessage))
      setStats(statsResponse.data)
      setRecipients(normalizeRecipients(recipientsResponse.data))
      setTemplates(templatesResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load communication data.")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    void fetchCommunicationData()
  }, [fetchCommunicationData])

  const saveEvent = useCallback(
    async (payload: CommunicationEventPayload, eventId?: string) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = eventId
          ? await (api.communication.updateEvent(eventId, payload) as Promise<ApiResponse<CommunicationEventRecord>>)
          : await (api.communication.createEvent(payload) as Promise<ApiResponse<CommunicationEventRecord>>)
        await fetchCommunicationData()
        return {
          event: normalizeEvent(response.data),
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save communication event."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchCommunicationData],
  )

  const sendMessage = useCallback(
    async (payload: CommunicationMessagePayload) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.communication.sendSMS({
          ...payload,
          channel: "sms",
        }) as Promise<ApiResponse<CommunicationMessageRecord>>)
        await fetchCommunicationData()
        return {
          messageRecord: normalizeMessage(response.data),
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send SMS message."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchCommunicationData],
  )

  const getEventDetails = useCallback(async (eventId: string) => {
    const response = (await api.communication.getEvent(eventId)) as ApiResponse<CommunicationEventRecord>

    return {
      ...normalizeEvent(response.data),
      messages: (response.data.messages ?? []).map(normalizeMessage),
    } satisfies CommunicationEventDetails
  }, [])

  return {
    events,
    messages,
    stats,
    recipients,
    templates,
    loading,
    isSaving,
    error,
    refetch: fetchCommunicationData,
    loadRecipients,
    saveEvent,
    sendMessage,
    getEventDetails,
  }
}
