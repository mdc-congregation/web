"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, CreditCard, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SMSCreditsModal } from "./sms-credits-modal"

const integrations = [
  {
    id: "email",
    name: "Email Service",
    description: "SMTP configuration for sending emails",
    icon: Mail,
    enabled: true,
    status: "connected",
  },
  {
    id: "sms",
    name: "SMS Service",
    description: "SMS gateway for text messaging",
    icon: MessageSquare,
    enabled: true,
    status: "disconnected",
  },
  {
    id: "payment",
    name: "Payment Gateway",
    description: "Online donation processing",
    icon: CreditCard,
    enabled: true,
    status: "connected",
  },
  {
    id: "calendar",
    name: "Calendar Sync",
    description: "Sync events with external calendars",
    icon: Calendar,
    enabled: false,
    status: "disconnected",
  },
]

export function IntegrationSettings() {
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    username: "church@gracechurch.org",
    password: "",
    fromName: "Grace Church",
  })

  const [isSMSCreditsModalOpen, setIsSMSCreditsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Integrations</h2>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <integration.icon className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                    {integration.status}
                  </Badge>
                  <Switch checked={integration.enabled} />
                </div>
              </div>
            </CardHeader>
            {integration.id === "email" && integration.enabled && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={emailSettings.username}
                      onChange={(e) => setEmailSettings({ ...emailSettings, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={emailSettings.password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button>Save Email Settings</Button>
                </div>
              </CardContent>
            )}
            {integration.id === "sms" && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smsProvider">SMS Provider</Label>
                      <Select defaultValue="twilio">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                          <SelectItem value="messagebird">MessageBird</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input id="apiKey" type="password" placeholder="Enter your API key" />
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">SMS Credits</h4>
                      <Button size="sm" onClick={() => setIsSMSCreditsModalOpen(true)}>
                        Buy Credits
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Current Balance:</span>
                        <span className="font-medium">2,450 credits</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate per SMS:</span>
                        <span>$0.10</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Last Purchase:</span>
                        <span>Jan 15, 2024</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save SMS Settings</Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      <SMSCreditsModal isOpen={isSMSCreditsModalOpen} onClose={() => setIsSMSCreditsModalOpen(false)} />
    </div>
  )
}
