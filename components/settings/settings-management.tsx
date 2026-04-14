"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChurchSettings } from "./church-settings"
import { UserSettings } from "./user-settings"
import { RolesSettings } from "./roles-settings"
import { useSettings } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"

export function SettingsManagement() {
  const { toast } = useToast()
  const settings = useSettings()

  useEffect(() => {
    if (!settings.error) {
      return
    }

    toast({
      title: "Settings error",
      description: settings.error,
      variant: "destructive",
    })
  }, [settings.error, toast])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage church information, users, roles, and passwords.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure your church management system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="church" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="church">Church Info</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="church">
                <ChurchSettings
                  church={settings.church}
                  isSaving={settings.isSaving}
                  onSave={settings.saveChurch}
                />
              </TabsContent>
              <TabsContent value="users">
                <UserSettings
                  users={settings.users}
                  roles={settings.roles}
                  isSaving={settings.isSaving}
                  onSaveUser={settings.saveUser}
                  onChangeOwnPassword={settings.changeOwnPassword}
                  onUpdateUserPassword={settings.updateUserPassword}
                />
              </TabsContent>
              <TabsContent value="roles">
                <RolesSettings
                  roles={settings.roles}
                  permissions={settings.permissions}
                  isSaving={settings.isSaving}
                  onSaveRole={settings.saveRole}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
