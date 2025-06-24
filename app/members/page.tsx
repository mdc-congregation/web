import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MembersManagement } from "@/components/members/members-management"

export default function MembersPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Members" }]}>
      <MembersManagement />
    </DashboardLayout>
  )
}
