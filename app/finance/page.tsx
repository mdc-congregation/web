import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FinanceManagement } from "@/components/finance/finance-management"

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout breadcrumbs={[{ label: "Finance" }]}>
        <FinanceManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
