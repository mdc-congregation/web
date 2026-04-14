"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/utils/api-client"

type ApiResponse<T> = {
  status: boolean
  message: string
  data: T
}

export type ChurchSettingsRecord = {
  id: string
  church_name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  mission?: string | null
  logo_url?: string | null
}

export type SettingsPermission = {
  id: number
  name: string
  label: string
  category: string
  guard_name: string
}

export type SettingsRole = {
  id: number
  name: string
  guard_name: string
  permissions: SettingsPermission[]
  users_count: number
}

export type SettingsUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  phone?: string | null
  status: "active" | "inactive" | "suspended"
  roles: SettingsRole[]
}

export type SaveChurchPayload = {
  church_name: string
  address: string
  phone: string
  email: string
  website: string
  mission: string
  logo_url?: string | null
}

export type SaveUserPayload = {
  firstname: string
  lastname: string
  email: string
  phone?: string
  password?: string
  status: "active" | "inactive" | "suspended"
  role_names: string[]
}

export function useSettings() {
  const [church, setChurch] = useState<ChurchSettingsRecord | null>(null)
  const [users, setUsers] = useState<SettingsUser[]>([])
  const [roles, setRoles] = useState<SettingsRole[]>([])
  const [permissions, setPermissions] = useState<SettingsPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [churchResponse, usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        api.settings.getChurch() as Promise<ApiResponse<ChurchSettingsRecord>>,
        api.settings.getUsers() as Promise<ApiResponse<SettingsUser[]>>,
        api.settings.getRoles() as Promise<ApiResponse<SettingsRole[]>>,
        api.settings.getPermissions() as Promise<ApiResponse<SettingsPermission[]>>,
      ])

      setChurch(churchResponse.data)
      setUsers(usersResponse.data)
      setRoles(rolesResponse.data)
      setPermissions(permissionsResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSettings()
  }, [fetchSettings])

  const saveChurch = useCallback(
    async (payload: SaveChurchPayload) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = (await api.settings.updateChurch(payload)) as ApiResponse<ChurchSettingsRecord>
        setChurch(response.data)
        return response.message
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save church settings."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [],
  )

  const saveUser = useCallback(
    async (payload: SaveUserPayload, userId?: string) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = userId
          ? ((await api.settings.updateUser(userId, payload)) as ApiResponse<SettingsUser>)
          : ((await api.settings.createUser(payload)) as ApiResponse<SettingsUser>)
        await fetchSettings()
        return { user: response.data, message: response.message }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save user."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchSettings],
  )

  const updateUserPassword = useCallback(async (userId: string, password: string) => {
    try {
      setIsSaving(true)
      setError(null)
      const response = (await api.settings.updateUserPassword(userId, { password })) as ApiResponse<null>
      return response.message
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user password."
      setError(message)
      throw new Error(message)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const changeOwnPassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setIsSaving(true)
      setError(null)
      const response = (await api.settings.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })) as ApiResponse<null>
      return response.message
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change password."
      setError(message)
      throw new Error(message)
    } finally {
      setIsSaving(false)
    }
  }, [])

  const saveRole = useCallback(
    async (payload: { name: string; permissions: string[] }, roleId?: number) => {
      try {
        setIsSaving(true)
        setError(null)
        const response = roleId
          ? ((await api.settings.updateRole(String(roleId), payload)) as ApiResponse<SettingsRole>)
          : ((await api.settings.createRole(payload)) as ApiResponse<SettingsRole>)
        await fetchSettings()
        return { role: response.data, message: response.message }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save role."
        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [fetchSettings],
  )

  return {
    church,
    users,
    roles,
    permissions,
    loading,
    isSaving,
    error,
    refetch: fetchSettings,
    saveChurch,
    saveUser,
    updateUserPassword,
    changeOwnPassword,
    saveRole,
  }
}
