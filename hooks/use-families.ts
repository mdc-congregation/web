"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type FamilyMember = {
  id: string
  first_name: string
  last_name: string
  phone?: string | null
  membership_status?: string | null
}

type FamilyRecord = {
  id: string
  name: string
  created_at?: string
  members: FamilyMember[]
}

type FamiliesListPayload = {
  current_page: number
  data: FamilyRecord[]
  total: number
  per_page: number
  last_page: number
  from: number | null
  to: number | null
}

type MemberRecord = {
  id: string
  first_name: string
  last_name: string
  phone?: string | null
  membership_status?: string | null
}

type MembersListPayload = {
  data: MemberRecord[]
}

export type FamilyListItem = {
  id: string
  name: string
  createdAt?: string
  memberCount: number
  members: Array<{
    id: string
    name: string
    phone?: string | null
    status?: string | null
  }>
}

type PaginationState = {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number
  to: number
}

const normalizeFamily = (family: FamilyRecord): FamilyListItem => ({
  id: family.id,
  name: family.name,
  createdAt: family.created_at,
  memberCount: family.members.length,
  members: family.members.map((member) => ({
    id: member.id,
    name: `${member.first_name} ${member.last_name}`.trim(),
    phone: member.phone,
    status: member.membership_status,
  })),
})

export function useFamilies(searchTerm: string, page: number, perPage: number) {
  const [families, setFamilies] = useState<FamilyListItem[]>([])
  const [memberOptions, setMemberOptions] = useState<Array<{ id: string; name: string; phone?: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0,
  })

  const fetchFamilies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await (api.families.getAll({
        page: String(page),
        per_page: String(perPage),
        ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      }) as Promise<ApiResponse<FamiliesListPayload>>)

      setFamilies(response.data.data.map(normalizeFamily))
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
        from: response.data.from ?? 0,
        to: response.data.to ?? 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load families.")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, searchTerm])

  const fetchMemberOptions = useCallback(async () => {
    try {
      const response = await (api.members.getAll({ per_page: "100" }) as Promise<ApiResponse<MembersListPayload>>)
      setMemberOptions(
        response.data.data.map((member) => ({
          id: member.id,
          name: `${member.first_name} ${member.last_name}`.trim(),
          phone: member.phone,
        })),
      )
    } catch (err) {
      console.error("[v0] Failed to load member options:", err)
    }
  }, [])

  useEffect(() => {
    void fetchFamilies()
  }, [fetchFamilies])

  useEffect(() => {
    void fetchMemberOptions()
  }, [fetchMemberOptions])

  const createFamily = useCallback(
    async (name: string) => {
      setIsSaving(true)
      try {
        const response = await (api.families.create({ name }) as Promise<ApiResponse<FamilyRecord>>)
        await fetchFamilies()
        return {
          family: normalizeFamily(response.data),
          message: response.message,
        }
      } finally {
        setIsSaving(false)
      }
    },
    [fetchFamilies],
  )

  const updateFamily = useCallback(
    async (id: string, name: string) => {
      setIsSaving(true)
      try {
        const response = await (api.families.update(id, { name }) as Promise<ApiResponse<FamilyRecord>>)
        await fetchFamilies()
        return {
          family: normalizeFamily(response.data),
          message: response.message,
        }
      } finally {
        setIsSaving(false)
      }
    },
    [fetchFamilies],
  )

  const deleteFamily = useCallback(
    async (id: string) => {
      setIsSaving(true)
      try {
        const response = await (api.families.delete(id) as Promise<ApiResponse<null>>)
        await fetchFamilies()
        return response.message
      } finally {
        setIsSaving(false)
      }
    },
    [fetchFamilies],
  )

  const getFamily = useCallback(async (id: string) => {
    const response = await (api.families.getById(id) as Promise<ApiResponse<FamilyRecord>>)
    return normalizeFamily(response.data)
  }, [])

  const addMembers = useCallback(async (id: string, memberIds: string[]) => {
    setIsSaving(true)
    try {
      const response = await (api.families.addMembers(id, { member_ids: memberIds }) as Promise<ApiResponse<FamilyRecord>>)
      await fetchFamilies()
      return {
        family: normalizeFamily(response.data),
        message: response.message,
      }
    } finally {
      setIsSaving(false)
    }
  }, [fetchFamilies])

  const removeMember = useCallback(async (id: string, memberId: string) => {
    setIsSaving(true)
    try {
      const response = await (api.families.removeMember(id, memberId) as Promise<ApiResponse<unknown>>)
      await fetchFamilies()
      return response.message
    } finally {
      setIsSaving(false)
    }
  }, [fetchFamilies])

  return {
    families,
    memberOptions,
    loading,
    isSaving,
    error,
    pagination,
    refetch: fetchFamilies,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamily,
    addMembers,
    removeMember,
  }
}
