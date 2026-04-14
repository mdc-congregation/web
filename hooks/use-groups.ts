"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"
import { emptyGroupFormValues, normalizeGroup, serializeGroupForm, type GroupApiRecord, type GroupFormValues, type GroupView } from "@/utils/groups"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

type GroupsListPayload = {
  current_page: number
  data: GroupApiRecord[]
  total: number
  per_page: number
  last_page: number
  from: number | null
  to: number | null
}

type GroupStatsPayload = {
  total_groups: {
    count: number
    added_since_last_month: number
  }
  ministry_teams: {
    count: number
    percentage: number
  }
  departments: {
    count: number
    percentage: number
  }
  committees: {
    count: number
    percentage: number
  }
}

type MemberOption = {
  id: string
  first_name: string
  last_name: string
  phone?: string | null
}

export function useGroups(searchTerm: string, groupType: string, page: number, perPage: number) {
  const [groups, setGroups] = useState<GroupView[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<GroupStatsPayload | null>(null)
  const [memberOptions, setMemberOptions] = useState<Array<{ id: string; name: string; phone?: string | null }>>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 5,
    total: 0,
    from: 0,
    to: 0,
  })

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [groupsResponse, statsResponse, membersResponse] = await Promise.all([
        api.groups.getAll({
          page: String(page),
          per_page: String(perPage),
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
          ...(groupType && groupType !== "all" ? { group_type: groupType } : {}),
        }) as Promise<ApiResponse<GroupsListPayload>>,
        api.groups.getStats() as Promise<ApiResponse<GroupStatsPayload>>,
        api.members.getOptions() as Promise<ApiResponse<MemberOption[]>>,
      ])

      setGroups(groupsResponse.data.data.map(normalizeGroup))
      setPagination({
        currentPage: groupsResponse.data.current_page,
        lastPage: groupsResponse.data.last_page,
        perPage: groupsResponse.data.per_page,
        total: groupsResponse.data.total,
        from: groupsResponse.data.from ?? 0,
        to: groupsResponse.data.to ?? 0,
      })
      setStats(statsResponse.data)
      setMemberOptions(
        membersResponse.data.map((member) => ({
          id: member.id,
          name: `${member.first_name} ${member.last_name}`.trim(),
          phone: member.phone,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups.")
    } finally {
      setLoading(false)
    }
  }, [groupType, page, perPage, searchTerm])

  useEffect(() => {
    void fetchGroups()
  }, [fetchGroups])

  const saveGroup = useCallback(
    async (formData: GroupFormValues, existingGroup?: GroupView | null) => {
      try {
        setIsSaving(true)
        setError(null)

        const response = (existingGroup
          ? await (api.groups.update(existingGroup.id, serializeGroupForm(formData)) as Promise<ApiResponse<GroupApiRecord>>)
          : await (api.groups.create(serializeGroupForm(formData)) as Promise<ApiResponse<GroupApiRecord>>))

        await fetchGroups()
        return {
          group: normalizeGroup(response.data),
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save group."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchGroups],
  )

  const getGroup = useCallback(async (id: string) => {
    const response = await (api.groups.getById(id) as Promise<ApiResponse<GroupApiRecord>>)
    return normalizeGroup(response.data)
  }, [])

  const addMember = useCallback(
    async (groupId: string, payload: { member_id: string; role: string; joined_date: string; status: string }) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.groups.addMember(groupId, payload) as Promise<ApiResponse<GroupApiRecord>>)
        await fetchGroups()
        return {
          group: normalizeGroup(response.data),
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add member to group."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchGroups],
  )

  const removeMember = useCallback(
    async (groupId: string, memberId: string) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.groups.removeMember(groupId, memberId) as Promise<ApiResponse<GroupApiRecord>>)
        await fetchGroups()
        return response.message
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove member from group."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchGroups],
  )

  const updateMemberRole = useCallback(
    async (groupId: string, memberId: string, role: "leader" | "member" | "observer") => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.groups.updateMemberRole(groupId, memberId, { role }) as Promise<ApiResponse<GroupApiRecord>>)
        await fetchGroups()
        return {
          group: normalizeGroup(response.data),
          message: response.message,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update group member role."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchGroups],
  )

  const deleteGroup = useCallback(
    async (groupId: string) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = await (api.groups.delete(groupId) as Promise<ApiResponse<null>>)
        await fetchGroups()
        return response.message
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete group."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchGroups],
  )

  return {
    groups,
    stats,
    pagination,
    memberOptions,
    loading,
    isSaving,
    error,
    emptyForm: emptyGroupFormValues,
    refetch: fetchGroups,
    saveGroup,
    getGroup,
    addMember,
    removeMember,
    updateMemberRole,
    deleteGroup,
  }
}
