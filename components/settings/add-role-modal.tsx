"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { SettingsPermission, SettingsRole } from "@/hooks/use-settings"

interface AddRoleModalProps {
  isOpen: boolean
  onClose: () => void
  role?: SettingsRole | null
  permissions: SettingsPermission[]
  isSaving: boolean
  onSave: (payload: { name: string; permissions: string[] }, roleId?: number) => Promise<void>
}

export function AddRoleModal({ isOpen, onClose, role, permissions, isSaving, onSave }: AddRoleModalProps) {
  const [name, setName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setName(role?.name ?? "")
    setSelectedPermissions(role?.permissions.map((permission) => permission.name) ?? [])
  }, [isOpen, role])

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

  const togglePermission = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((current) =>
      checked ? [...current, permissionName] : current.filter((item) => item !== permissionName),
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSave({ name: name.trim(), permissions: selectedPermissions }, role?.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>Create a role and assign the permissions it should hold.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ministry Leader" required />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Permissions</h3>
              {Object.entries(groupedPermissions).map(([category, grouped]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-medium">{category}</h4>
                  <div className="space-y-2">
                    {grouped.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${category}-${permission.id}`}
                          checked={selectedPermissions.includes(permission.name)}
                          onCheckedChange={(checked) => togglePermission(permission.name, checked as boolean)}
                        />
                        <label htmlFor={`${category}-${permission.id}`} className="text-sm">
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : role ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
