"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { GroupDetailsModal } from "./group-details-modal"

interface Group {
  id: string
  name: string
  description: string
  type: "ministry" | "small" | "committee"
  leader: string
  memberCount: number
  meetingSchedule?: string
  status: "active" | "inactive"
}

interface GroupsTableProps {
  groups: Group[]
  loading: boolean
  onEditGroup: (group: Group) => void
}

export function GroupsTable({ groups, loading, onEditGroup }: GroupsTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  if (loading) {
    return <div className="text-center py-8">Loading groups...</div>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ministry":
        return "Ministry Team"
      case "small":
        return "Small Group"
      case "committee":
        return "Committee"
      default:
        return type
    }
  }

  const handleViewDetails = (group: Group) => {
    setSelectedGroup(group)
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
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-muted-foreground">{group.description}</div>
              </TableCell>
              <TableCell>{getTypeLabel(group.type)}</TableCell>
              <TableCell>{group.leader}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleViewDetails(group)}>
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
          ))}
        </TableBody>
      </Table>
      <GroupDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedGroup(null)
        }}
        group={selectedGroup}
      />
    </div>
  )
}
