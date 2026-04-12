import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GroupsManagement } from "@/components/groups/groups-management"

export default function GroupsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Groups" }]}>
        <GroupsManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
