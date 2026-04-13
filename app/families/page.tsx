import { ProtectedRoute } from "@/components/auth/protected-route"
import { FamilyManagement } from "@/components/families/family-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function FamiliesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Families" }]}>
        <FamilyManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
