import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CommunicationManagement } from "@/components/communication/communication-management"

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Communication" }]}>
        <CommunicationManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
