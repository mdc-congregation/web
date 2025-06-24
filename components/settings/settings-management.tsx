"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChurchSettings } from "./church-settings"
import { UserSettings } from "./user-settings"
import { RolesSettings } from "./roles-settings"
import { IntegrationSettings } from "./integration-settings"

export function SettingsManagement() {
  const [activeTab, setActiveTab] = useState("church")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your church and system settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure your church management system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="church" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="church">Church Info</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="church">
                <ChurchSettings />
              </TabsContent>
              <TabsContent value="users">
                <UserSettings />
              </TabsContent>
              <TabsContent value="roles">
                <RolesSettings />
              </TabsContent>
              <TabsContent value="integrations">
                <IntegrationSettings />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
