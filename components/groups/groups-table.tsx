"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { GroupDetailsModal } from "./group-details-modal"
import type { GroupView } from "@/utils/groups"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface GroupsTableProps {
  groups: GroupView[]
  loading: boolean
  onEditGroup: (group: GroupView) => void
  memberOptions: Array<{ id: string; name: string; phone?: string | null }>
  onRefresh: (groupId: string) => Promise<GroupView>
  onAddMember: (groupId: string, payload: { member_id: string; role: string; joined_date: string; status: string }) => Promise<{ group: GroupView; message: string }>
  onRemoveMember: (groupId: string, memberId: string) => Promise<string>
  onUpdateMemberRole: (groupId: string, memberId: string, role: "leader" | "member" | "observer") => Promise<{ group: GroupView; message: string }>
  onDeleteGroup: (groupId: string) => Promise<string>
  isSaving: boolean
  currentPage: number
  lastPage: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
}

export function GroupsTable({
  groups,
  loading,
  onEditGroup,
  memberOptions,
  onRefresh,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onDeleteGroup,
  isSaving,
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: GroupsTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupView | null>(null)

  if (loading) {
    return <div className="text-center py-8">Loading groups...</div>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ministry":
        return "Ministry Team"
      case "department":
        return "Department"
      case "committee":
        return "Committee"
      default:
        return type
    }
  }

  const handleViewDetails = async (group: GroupView) => {
    const freshGroup = await onRefresh(group.id)
    setSelectedGroup(freshGroup)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Leader</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Meeting Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No groups found.
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-muted-foreground">{group.description}</div>
                </TableCell>
                <TableCell>{getTypeLabel(group.type)}</TableCell>
                <TableCell>{group.leader || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {group.memberCount}
                  </div>
                </TableCell>
                <TableCell>{group.meetingSchedule || "-"}</TableCell>
                <TableCell>
                  <Badge variant={group.status === "active" ? "default" : "secondary"}>{group.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => void handleViewDetails(group)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditGroup(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? `Showing ${from} to ${to} of ${total} groups` : "No groups found"}
        </p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1)
                  }
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-3 text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (currentPage < lastPage) {
                    onPageChange(currentPage + 1)
                  }
                }}
                className={currentPage >= lastPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <GroupDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedGroup(null)
        }}
        group={selectedGroup}
        memberOptions={memberOptions}
        onRefresh={onRefresh}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        onUpdateMemberRole={onUpdateMemberRole}
        onDeleteGroup={onDeleteGroup}
        isSaving={isSaving}
      />
    </div>
  )
}
