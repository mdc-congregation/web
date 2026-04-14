"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import { getAuthUser } from "@/utils/auth"
import { api } from "@/utils/api-client"
import type { ChurchSettingsRecord, SaveChurchPayload } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface ChurchSettingsProps {
  church: ChurchSettingsRecord | null
  isSaving: boolean
  onSave: (payload: SaveChurchPayload) => Promise<string>
}

const emptyForm: SaveChurchPayload = {
  church_name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  mission: "",
  logo_url: "",
}

export function ChurchSettings({ church, isSaving, onSave }: ChurchSettingsProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<SaveChurchPayload>(emptyForm)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  useEffect(() => {
    if (!church) {
      return
    }

    setFormData({
      church_name: church.church_name ?? "",
      address: church.address ?? "",
      phone: church.phone ?? "",
      email: church.email ?? "",
      website: church.website ?? "",
      mission: church.mission ?? "",
      logo_url: church.logo_url ?? "",
    })
    setLogoPreview(church.logo_url ?? null)
  }, [church])

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const currentUser = getAuthUser()

    if (!file || !currentUser) {
      return
    }

    try {
      setIsUploadingLogo(true)
      const response = (await api.uploads.file(file, {
        upload_type: "general",
        user_id: currentUser.id,
      })) as { data?: { url?: string } }

      const logoUrl = response.data?.url

      if (!logoUrl) {
        throw new Error("Logo upload failed.")
      }

      setLogoPreview(logoUrl)
      setFormData((current) => ({
        ...current,
        logo_url: logoUrl,
      }))
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unable to upload logo.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const message = await onSave(formData)
      window.dispatchEvent(new CustomEvent("church-settings-updated", { detail: formData }))
      toast({
        title: "Church settings updated",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save church settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="churchName">Church Name</Label>
            <Input
              id="churchName"
              value={formData.church_name}
              onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea id="mission" rows={4} value={formData.mission} onChange={(e) => setFormData({ ...formData, mission: e.target.value })} />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Label htmlFor="logo">Church Logo</Label>
                <Avatar className="h-32 w-32 rounded-xl">
                  <AvatarImage src={logoPreview || "/placeholder.svg?height=128&width=128"} alt="Church Logo" />
                  <AvatarFallback>{formData.church_name.slice(0, 2).toUpperCase() || "CH"}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <Label htmlFor="logo" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground">
                      <Upload className="h-4 w-4" />
                      <span>{isUploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                    </div>
                  </Label>
                  <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={isUploadingLogo} />
                </div>
                <p className="text-xs text-muted-foreground">The saved logo is used in the dashboard branding.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || isUploadingLogo}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
