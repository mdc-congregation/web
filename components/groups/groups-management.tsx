"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter } from "lucide-react"
import { GroupsTable } from "./groups-table"
import { GroupModal } from "./group-modal"
import { useGroups } from "@/hooks/use-groups"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GroupsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const { groups, stats, pagination, memberOptions, loading, isSaving, error, saveGroup, getGroup, addMember, removeMember, updateMemberRole, deleteGroup } =
    useGroups(debouncedSearchTerm, activeTab, page, perPage)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [activeTab, debouncedSearchTerm, perPage])

  const handleAddGroup = () => {
    setSelectedGroup(null)
    setIsModalOpen(true)
  }

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Manage ministries, departments, and committees.</p>
        </div>
        <Button onClick={handleAddGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_groups.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.total_groups.added_since_last_month ?? 0} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministry Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.ministry_teams.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.ministry_teams.percentage ?? 0}% of total groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.departments.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.departments.percentage ?? 0}% of total groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Committees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.committees.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.committees.percentage ?? 0}% of total groups</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Group Directory</CardTitle>
          <CardDescription>Search and manage all church groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={String(perPage)}
              onChange={(event) => setPerPage(Number(event.target.value))}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
            <div className="inline-flex items-center rounded-md border px-3 text-sm text-muted-foreground">
              <Filter className="mr-2 h-4 w-4" />
              API filter tabs
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="ministry">Ministry Teams</TabsTrigger>
              <TabsTrigger value="committee">Committees</TabsTrigger>
              <TabsTrigger value="department">Departments</TabsTrigger>
            </TabsList>
          </Tabs>

          <GroupsTable
            groups={groups}
            loading={loading}
            memberOptions={memberOptions}
            onEditGroup={handleEditGroup}
            onRefresh={getGroup}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            onUpdateMemberRole={updateMemberRole}
            onDeleteGroup={deleteGroup}
            isSaving={isSaving}
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        group={selectedGroup}
        memberOptions={memberOptions}
        onSave={saveGroup}
        isSaving={isSaving}
      />
    </div>
  )
}
