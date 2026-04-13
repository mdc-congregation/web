"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"
import {
  emptyMemberFormValues,
  normalizeMember,
  serializeMemberForm,
  type Member,
  type MemberApiRecord,
  type MemberFormValues,
} from "@/utils/members"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type MembersListPayload = {
  current_page: number
  data: MemberApiRecord[]
  total: number
  per_page: number
  last_page: number
  from: number | null
  to: number | null
}

type MemberCountPayload = {
  count: number
  active: number
  inactive: number
  visitors: number
  new_this_month: number
}

export function useMembers(searchTerm: string, page: number, perPage: number) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0,
  })
  const [stats, setStats] = useState<MemberCountPayload>({
    count: 0,
    active: 0,
    inactive: 0,
    visitors: 0,
    new_this_month: 0,
  })

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [membersResponse, countResponse] = await Promise.all([
        api.members.getAll({
          page: String(page),
          per_page: String(perPage),
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
        }) as Promise<ApiResponse<MembersListPayload>>,
        api.members.getCount() as Promise<ApiResponse<MemberCountPayload>>,
      ])

      setMembers(membersResponse.data.data.map(normalizeMember))
      setPagination({
        currentPage: membersResponse.data.current_page,
        lastPage: membersResponse.data.last_page,
        perPage: membersResponse.data.per_page,
        total: membersResponse.data.total,
        from: membersResponse.data.from ?? 0,
        to: membersResponse.data.to ?? 0,
      })
      setStats(countResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members.")
    } finally {
      setLoading(false)
    }
  }, [page, perPage, searchTerm])

  useEffect(() => {
    void fetchMembers()
  }, [fetchMembers])

  const saveMember = useCallback(
    async (formData: MemberFormValues, memberId?: string) => {
      try {
        setIsSaving(true)
        setError(null)

        const payload = serializeMemberForm(formData)
        const response = (memberId
          ? await (api.members.update(memberId, payload) as Promise<ApiResponse<MemberApiRecord>>)
          : await (api.members.create(payload) as Promise<ApiResponse<MemberApiRecord>>))

        const savedMember = normalizeMember(response.data)
        await fetchMembers()

        return {
          member: savedMember,
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save member."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchMembers],
  )

  return {
    members,
    loading,
    isSaving,
    error,
    stats,
    pagination,
    emptyForm: emptyMemberFormValues,
    refetch: fetchMembers,
    saveMember,
  }
}
