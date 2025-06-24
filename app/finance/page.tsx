import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FinanceManagement } from "@/components/finance/finance-management"

export default function FinancePage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Finance" }]}>
      <FinanceManagement />
    </DashboardLayout>
  )
}
