import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CommunicationManagement } from "@/components/communication/communication-management"

export default function CommunicationPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Communication" }]}>
      <CommunicationManagement />
    </DashboardLayout>
  )
}
