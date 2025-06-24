import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsManagement } from "@/components/settings/settings-management"

export default function SettingsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Settings" }]}>
      <SettingsManagement />
    </DashboardLayout>
  )
}
