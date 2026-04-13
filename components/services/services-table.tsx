"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, Users, MessageSquare, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Service {
  id: string
  title: string
  type: string
  date: string
  time: string
  preacher: string
  chairman: string
  supporters: Array<{ memberId: string; name: string; role: string }>
  specialGuestNames: string[]
  location: string
  expectedAttendance: string
  actualAttendance?: number
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
}

interface ServicesTableProps {
  services: Service[]
  loading: boolean
  onEditService: (service: Service) => void
  onRecordAttendance: (service: Service) => void
  onSendNotification: (service: Service) => void
  onViewDetails: (service: Service) => void
  onDeleteService: (service: Service) => void
  currentPage: number
  lastPage: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
}

export function ServicesTable({
  services,
  loading,
  onEditService,
  onRecordAttendance,
  onSendNotification,
  onViewDetails,
  onDeleteService,
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: ServicesTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading services...</div>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sunday_service":
        return "Sunday Service"
      case "prayer_meeting":
        return "Prayer Meeting"
      case "bible_study":
        return "Bible Study"
      case "special_event":
        return "Special Event"
      case "conference":
        return "Conference"
      case "crusade":
        return "Crusade"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "outline"
      case "ongoing":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Leadership</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No services found.
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{service.title}</div>
                    <div className="text-sm text-muted-foreground">{getTypeLabel(service.type)}</div>
                    <div className="text-sm text-muted-foreground">{service.location}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{service.date}</div>
                    <div className="text-sm text-muted-foreground">{service.time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Preacher:</span> {service.preacher || "-"}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Chairman:</span> {service.chairman || "-"}
                    </div>
                    {service.specialGuestNames.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Guests:</span> {service.specialGuestNames.join(", ")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {service.actualAttendance || service.expectedAttendance || 0}
                      {service.actualAttendance && service.expectedAttendance ? ` / ${service.expectedAttendance}` : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(service.status)}>{service.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(service)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditService(service)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRecordAttendance(service)}>
                        <Users className="mr-2 h-4 w-4" />
                        Record Attendance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendNotification(service)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteService(service)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
          {total > 0 ? `Showing ${from} to ${to} of ${total} services` : "No services found"}
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
    </div>
  )
}
