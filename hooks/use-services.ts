"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"
import {
  emptyServiceFormValues,
  normalizeService,
  serializeServiceForm,
  type ServiceApiRecord,
  type ServiceFormValues,
  type ServiceView,
} from "@/utils/services"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type ServicesListPayload = {
  current_page: number
  data: ServiceApiRecord[]
  total: number
  per_page: number
  last_page: number
  from: number | null
  to: number | null
}

type ServiceStatsPayload = {
  total_services: {
    count: number
    percentage_increase: number
  }
  scheduled_services: {
    count: number
    percentage_of_total: number
  }
  upcoming_services: number
  attendance_this_week: {
    count: number
    percentage_increase: number
  }
}

type MemberOption = {
  id: string
  first_name: string
  last_name: string
  phone?: string | null
}

type MembersPayload = {
  data: MemberOption[]
}

export function useServices(searchTerm: string, page: number, perPage: number) {
  const [services, setServices] = useState<ServiceView[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ServiceStatsPayload | null>(null)
  const [memberOptions, setMemberOptions] = useState<Array<{ id: string; name: string; phone?: string | null }>>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0,
  })

  const fetchServicesData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [servicesResponse, statsResponse, membersResponse] = await Promise.all([
        api.services.getAll({
          page: String(page),
          per_page: String(perPage),
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
        }) as Promise<
          ApiResponse<ServicesListPayload>
        >,
        api.services.getStats() as Promise<ApiResponse<ServiceStatsPayload>>,
        api.members.getAll({ per_page: "100" }) as Promise<ApiResponse<MembersPayload>>,
      ])

      const normalizedServices = servicesResponse.data.data.map(normalizeService)
      setServices(normalizedServices)
      setPagination({
        currentPage: servicesResponse.data.current_page,
        lastPage: servicesResponse.data.last_page,
        perPage: servicesResponse.data.per_page,
        total: servicesResponse.data.total,
        from: servicesResponse.data.from ?? 0,
        to: servicesResponse.data.to ?? 0,
      })
      setStats(statsResponse.data)
      setMemberOptions(
        membersResponse.data.data.map((member) => ({
          id: member.id,
          name: `${member.first_name} ${member.last_name}`.trim(),
          phone: member.phone,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services.")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, searchTerm])

  useEffect(() => {
    void fetchServicesData()
  }, [fetchServicesData])

  const saveService = useCallback(
    async (formData: ServiceFormValues, existingService?: ServiceView | null) => {
      try {
        setIsSaving(true)
        setError(null)

        const response = (existingService
          ? await (api.services.update(existingService.id, serializeServiceForm(formData)) as Promise<ApiResponse<ServiceApiRecord>>)
          : await (api.services.create(serializeServiceForm(formData)) as Promise<ApiResponse<ServiceApiRecord>>))

        const savedService = normalizeService(response.data)

        const existingSupporters = new Map((existingService?.supporters ?? []).map((supporter) => [supporter.memberId, supporter.role]))
        const nextSupporters = new Map(formData.supporters.map((supporter) => [supporter.memberId, supporter.role]))

        if (existingService) {
          for (const supporter of existingService.supporters) {
            if (!nextSupporters.has(supporter.memberId) || nextSupporters.get(supporter.memberId) !== supporter.role) {
              await api.services.removeSupporter(savedService.id, supporter.memberId)
            }
          }
        }

        for (const supporter of formData.supporters) {
          if (!existingSupporters.has(supporter.memberId) || existingSupporters.get(supporter.memberId) !== supporter.role) {
            await api.services.addSupporter(savedService.id, {
              member_id: supporter.memberId,
              role: supporter.role,
            })
          }
        }

        await fetchServicesData()
        return {
          service: savedService,
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save service."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchServicesData],
  )

  const updateAttendance = useCallback(
    async (serviceId: string, attendance: number) => {
      const response = await (api.services.update(serviceId, { attendance }) as Promise<ApiResponse<ServiceApiRecord>>)
      await fetchServicesData()
      return response.message
    },
    [fetchServicesData],
  )

  const sendNotification = useCallback(
    async (serviceId: string, announcementMessage: string) => {
      const response = await (api.services.sendNotifications(serviceId, { announcement_message: announcementMessage }) as Promise<
        ApiResponse<{ recipient_count: number }>
      >)
      await fetchServicesData()
      return response.message
    },
    [fetchServicesData],
  )

  const deleteService = useCallback(
    async (serviceId: string) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.services.delete(serviceId) as Promise<ApiResponse<null>>)
        await fetchServicesData()
        return response.message
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete service."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchServicesData],
  )

  return {
    services,
    attendance: services
      .filter((service) => service.actualAttendance !== undefined && service.actualAttendance !== null)
      .map((service) => {
        const expected = Number(service.expectedAttendance || 0)
        const actual = Number(service.actualAttendance || 0)
        return {
          id: service.id,
          serviceTitle: service.title,
          date: service.date,
          expectedAttendance: expected,
          actualAttendance: actual,
          attendanceRate: expected > 0 ? Number(((actual / expected) * 100).toFixed(1)) : 0,
          type: service.type,
        }
      }),
    stats,
    pagination,
    memberOptions,
    loading,
    isSaving,
    error,
    emptyForm: emptyServiceFormValues,
    refetch: fetchServicesData,
    saveService,
    updateAttendance,
    sendNotification,
    deleteService,
  }
}
