import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsManagement } from "@/components/settings/settings-management"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Settings" }]}>
        <SettingsManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
