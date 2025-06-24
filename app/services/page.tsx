import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ServicesManagement } from "@/components/services/services-management"

export default function ServicesPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Services" }]}>
      <ServicesManagement />
    </DashboardLayout>
  )
}
