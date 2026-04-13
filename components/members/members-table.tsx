"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Eye, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TitheModal } from "./tithe-modal"
import { MemberDetailsModal } from "./member-details-modal"
import { useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "inactive" | "visitor"
  dateOfBirthShort?: string
  family?: string
  ministry?: string
  avatar?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  address?: string
  notes?: string
  isBaptized?: boolean
  baptismDate?: string
  baptismLocation?: string
  contributions?: any[]
  yearlyTotal?: string
  monthlyAverage?: string
  lastContribution?: {
    amount: string
    date: string
  }
}

interface MembersTableProps {
  members: Member[]
  loading: boolean
  onEditMember: (member: Member) => void
  currentPage: number
  lastPage: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
}

export function MembersTable({
  members,
  loading,
  onEditMember,
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: MembersTableProps) {
  const [isTitheModalOpen, setIsTitheModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const handleAddTithe = (member: Member) => {
    setSelectedMember(member)
    setIsTitheModalOpen(true)
  }

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member)
    setIsDetailsModalOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Loading members...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Family</TableHead>
              <TableHead>Ministry</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">{member.phone || "-"}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    member.status === "active" ? "default" : member.status === "inactive" ? "secondary" : "outline"
                  }
                >
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>{member.dateOfBirthShort || "-"}</TableCell>
              <TableCell>{member.family || "-"}</TableCell>
              <TableCell>{member.ministry || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(member)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditMember(member)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddTithe(member)}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Add Tithe
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? `Showing ${from} to ${to} of ${total} members` : "No members found"}
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

      {/* Tithe Modal */}
      <TitheModal
        isOpen={isTitheModalOpen}
        onClose={() => {
          setIsTitheModalOpen(false)
          setSelectedMember(null)
        }}
        member={selectedMember}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedMember(null)
        }}
        member={selectedMember}
      />
    </div>
  )
}
