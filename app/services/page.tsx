import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ServicesManagement } from "@/components/services/services-management"

export default function ServicesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Services" }]}>
        <ServicesManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
