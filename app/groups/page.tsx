import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GroupsManagement } from "@/components/groups/groups-management"

export default function GroupsPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Groups" }]}>
      <GroupsManagement />
    </DashboardLayout>
  )
}
