"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ChurchSettings() {
  const [formData, setFormData] = useState({
    churchName: "Grace Church",
    address: "123 Main Street, Anytown, USA",
    phone: "(555) 123-4567",
    email: "info@gracechurch.org",
    website: "https://gracechurch.org",
    mission: "To love God, love people, and make disciples of Jesus Christ.",
    logo: "/placeholder.svg?height=128&width=128",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setFormData({ ...formData, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Church settings updated:", formData)
    // Show success message
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="churchName">Church Name</Label>
            <Input
              id="churchName"
              value={formData.churchName}
              onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Label htmlFor="logo">Church Logo</Label>
                <Avatar className="h-32 w-32">
                  <AvatarImage src={logoPreview || "/placeholder.svg?height=128&width=128"} alt="Church Logo" />
                  <AvatarFallback>GC</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <Label htmlFor="logo" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground">
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </div>
                  </Label>
                  <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 512x512px</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
