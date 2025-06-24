"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { AddRoleModal } from "./add-role-modal"

const permissions = [
  { id: "members_read", label: "View Members", category: "Members" },
  { id: "members_write", label: "Edit Members", category: "Members" },
  { id: "members_delete", label: "Delete Members", category: "Members" },
  { id: "finance_read", label: "View Finance", category: "Finance" },
  { id: "finance_write", label: "Edit Finance", category: "Finance" },
  { id: "events_read", label: "View Events", category: "Events" },
  { id: "events_write", label: "Edit Events", category: "Events" },
  { id: "groups_read", label: "View Groups", category: "Groups" },
  { id: "groups_write", label: "Edit Groups", category: "Groups" },
  { id: "communication_send", label: "Send Communications", category: "Communication" },
  { id: "settings_read", label: "View Settings", category: "Settings" },
  { id: "settings_write", label: "Edit Settings", category: "Settings" },
]

const roles = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all features",
    permissions: permissions.map((p) => p.id),
    userCount: 1,
  },
  {
    id: "manager",
    name: "Manager",
    description: "Access to most features except system settings",
    permissions: permissions.filter((p) => !p.id.includes("settings_write")).map((p) => p.id),
    userCount: 3,
  },
  {
    id: "user",
    name: "User",
    description: "Basic access to view and edit assigned areas",
    permissions: ["members_read", "events_read", "groups_read"],
    userCount: 8,
  },
]

export function RolesSettings() {
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [rolePermissions, setRolePermissions] = useState(selectedRole.permissions)
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false)

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role)
    setRolePermissions(role.permissions)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRolePermissions([...rolePermissions, permissionId])
    } else {
      setRolePermissions(rolePermissions.filter((p) => p !== permissionId))
    }
  }

  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Roles & Permissions</h2>
        <Button onClick={() => setIsAddRoleModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Roles</h3>
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-colors ${selectedRole.id === role.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleRoleSelect(role)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm">{role.name}</CardTitle>
                  <Badge variant="secondary">{role.userCount} users</Badge>
                </div>
                <CardDescription className="text-xs">{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Permissions for {selectedRole.name}</CardTitle>
              <CardDescription>Configure what this role can access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <div className="space-y-2">
                    {perms.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={rolePermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button>Save Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddRoleModal isOpen={isAddRoleModalOpen} onClose={() => setIsAddRoleModalOpen(false)} />
    </div>
  )
}
