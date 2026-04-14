"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import type { SettingsPermission, SettingsRole } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddRoleModal } from "./add-role-modal"

interface RolesSettingsProps {
  roles: SettingsRole[]
  permissions: SettingsPermission[]
  isSaving: boolean
  onSaveRole: (payload: { name: string; permissions: string[] }, roleId?: number) => Promise<{ role: SettingsRole; message: string }>
}

export function RolesSettings({ roles, permissions, isSaving, onSaveRole }: RolesSettingsProps) {
  const { toast } = useToast()
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(roles[0]?.id ?? null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<SettingsRole | null>(null)

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0] ?? null,
    [roles, selectedRoleId],
  )

  const groupedPermissions = useMemo(
    () =>
      permissions.reduce(
        (acc, permission) => {
          if (!acc[permission.category]) {
            acc[permission.category] = []
          }
          acc[permission.category].push(permission)
          return acc
        },
        {} as Record<string, SettingsPermission[]>,
      ),
    [permissions],
  )

  const openAddRole = () => {
    setEditingRole(null)
    setIsRoleModalOpen(true)
  }

  const openEditRole = (role: SettingsRole) => {
    setEditingRole(role)
    setIsRoleModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Roles & Permissions</h2>
        <Button onClick={openAddRole}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4">
          <h3 className="font-medium">Roles</h3>
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-colors ${selectedRole?.id === role.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedRoleId(role.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm">{role.name.replace(/_/g, " ")}</CardTitle>
                    <CardDescription className="text-xs">{role.permissions.length} permissions assigned</CardDescription>
                  </div>
                  <Badge variant="secondary">{role.users_count} users</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={(event) => {
                    event.stopPropagation()
                    openEditRole(role)
                  }}
                >
                  Edit role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Permissions for {selectedRole ? selectedRole.name.replace(/_/g, " ") : "Role"}</CardTitle>
              <CardDescription>These permissions are tied directly to the selected role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedRole ? (
                Object.entries(groupedPermissions).map(([category, grouped]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-sm font-medium">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {grouped.map((permission) => {
                        const enabled = selectedRole.permissions.some((item) => item.name === permission.name)

                        return (
                          <Badge key={permission.id} variant={enabled ? "default" : "outline"}>
                            {permission.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No roles available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={editingRole}
        permissions={permissions}
        isSaving={isSaving}
        onSave={async (payload, roleId) => {
          const response = await onSaveRole(payload, roleId)
          setSelectedRoleId(response.role.id)
          setIsRoleModalOpen(false)
          toast({
            title: roleId ? "Role updated" : "Role created",
            description: response.message,
          })
        }}
      />
    </div>
  )
}
