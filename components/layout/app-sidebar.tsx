"use client"

import { useEffect, useState } from "react"
import { Users, Calendar, DollarSign, MessageSquare, UserCheck, Settings, Church, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/utils/api-client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/", icon: Home }],
  },
  {
    title: "Management",
    items: [
      { title: "Members", url: "/members", icon: Users },
      { title: "Families", url: "/families", icon: Users },
      { title: "Services", url: "/services", icon: Calendar },
      { title: "Groups", url: "/groups", icon: UserCheck },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Finance", url: "/finance", icon: DollarSign },
      { title: "Communication", url: "/communication", icon: MessageSquare },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, isLoading } = useAuth()
  const [branding, setBranding] = useState<{ church_name: string; logo_url?: string | null } | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadBranding = async () => {
      const response = await (api.settings.getChurch() as Promise<{ data: { church_name: string; logo_url?: string | null } }>)
      if (!cancelled) {
        setBranding(response.data)
      }
    }

    void loadBranding().catch(() => {})

    const handleBrandingUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ church_name: string; logo_url?: string | null }>).detail
      if (detail) {
        setBranding(detail)
      }
    }

    window.addEventListener("church-settings-updated", handleBrandingUpdate)

    return () => {
      cancelled = true
      window.removeEventListener("church-settings-updated", handleBrandingUpdate)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                {branding?.logo_url ? (
                  <img src={branding.logo_url} alt={branding.church_name} className="size-8 rounded-lg object-cover" />
                ) : (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Church className="size-4" />
                  </div>
                )}
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{branding?.church_name ?? "Freedom Temple"}</span>
                  <span className="text-xs">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url || pathname === item.url + "/page"}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4 mr-2" />
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
