"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { KeyRound, Pencil, ShieldPlus } from "lucide-react"
import { getAuthUser } from "@/utils/auth"
import type { SettingsRole, SettingsUser, SaveUserPayload } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface UserSettingsProps {
  users: SettingsUser[]
  roles: SettingsRole[]
  isSaving: boolean
  onSaveUser: (payload: SaveUserPayload, userId?: string) => Promise<{ user: SettingsUser; message: string }>
  onChangeOwnPassword: (currentPassword: string, newPassword: string) => Promise<string>
  onUpdateUserPassword: (userId: string, password: string) => Promise<string>
}

const emptyUserForm = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  status: "active" as "active" | "inactive" | "suspended",
  roleName: "",
}

export function UserSettings({
  users,
  roles,
  isSaving,
  onSaveUser,
  onChangeOwnPassword,
  onUpdateUserPassword,
}: UserSettingsProps) {
  const { toast } = useToast()
  const currentUser = useMemo(() => getAuthUser(), [])
  const [formData, setFormData] = useState(emptyUserForm)
  const [editingUser, setEditingUser] = useState<SettingsUser | null>(null)
  const [passwordDialogUser, setPasswordDialogUser] = useState<SettingsUser | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const resetUserForm = () => {
    setFormData(emptyUserForm)
    setEditingUser(null)
  }

  const handleEditUser = (user: SettingsUser) => {
    setEditingUser(user)
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone ?? "",
      password: "",
      status: user.status,
      roleName: user.roles[0]?.name ?? "",
    })
  }

  const handleSubmitUser = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await onSaveUser(
        {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          status: formData.status,
          role_names: [formData.roleName],
        },
        editingUser?.id,
      )

      resetUserForm()
      toast({
        title: editingUser ? "User updated" : "User created",
        description: response.message,
      })
    } catch (error) {
      toast({
        title: editingUser ? "Update failed" : "Create failed",
        description: error instanceof Error ? error.message : "Unable to save user.",
        variant: "destructive",
      })
    }
  }

  const handleChangeOwnPassword = async (event: React.FormEvent) => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    try {
      const message = await onChangeOwnPassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast({
        title: "Password changed",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Unable to change password.",
        variant: "destructive",
      })
    }
  }

  const handleResetManagedPassword = async () => {
    if (!passwordDialogUser || !newPassword) {
      return
    }

    try {
      const message = await onUpdateUserPassword(passwordDialogUser.id, newPassword)
      setNewPassword("")
      setPasswordDialogUser(null)
      toast({
        title: "Password updated",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Unable to update password.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? "Edit User Account" : "Create User Account"}</CardTitle>
            <CardDescription>Manage dashboard users, assign roles, and control account status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitUser} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as SaveUserPayload["status"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.roleName} onValueChange={(value) => setFormData({ ...formData, roleName: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingUser && (
                  <Button type="button" variant="outline" onClick={resetUserForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isSaving || !formData.roleName}>
                  <ShieldPlus className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : editingUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change My Password</CardTitle>
            <CardDescription>Update the password for the current signed-in user.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangeOwnPassword} className="space-y-4">
              <div className="rounded-lg border p-4 text-sm">
                <div className="font-medium">{currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : "Current user"}</div>
                <div className="text-muted-foreground">{currentUser?.email ?? "Authenticated session"}</div>
              </div>
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  {isSaving ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage existing dashboard users, roles, and account status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstname} {user.lastname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge key={`${user.id}-${role.id}`} variant="secondary">
                            {role.name.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setPasswordDialogUser(user)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Password
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No users available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(passwordDialogUser)} onOpenChange={(open) => !open && setPasswordDialogUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Set a new password for {passwordDialogUser ? `${passwordDialogUser.firstname} ${passwordDialogUser.lastname}` : "this user"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPasswordDialogUser(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={isSaving || !newPassword} onClick={() => void handleResetManagedPassword()}>
              {isSaving ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
