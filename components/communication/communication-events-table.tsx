"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, MessageSquare, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommunicationEvent {
  id: string
  title: string
  description: string
  createdDate: string
  status: "active" | "completed" | "draft"
  messagesSent: number
  totalRecipients: number
  type: "announcement" | "reminder" | "invitation" | "newsletter"
}

interface CommunicationEventsTableProps {
  events: CommunicationEvent[]
  loading: boolean
  onEditEvent: (event: CommunicationEvent) => void
  onSendMessage: (event: CommunicationEvent) => void
  onViewDetails: (event: CommunicationEvent) => void
}

export function CommunicationEventsTable({
  events,
  loading,
  onEditEvent,
  onSendMessage,
  onViewDetails,
}: CommunicationEventsTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading communication events...</div>
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "default"
      case "reminder":
        return "secondary"
      case "invitation":
        return "outline"
      case "newsletter":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Details</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Messages Sent</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getTypeColor(event.type)}>{event.type}</Badge>
              </TableCell>
              <TableCell>{event.createdDate}</TableCell>
              <TableCell className="font-medium">{event.messagesSent}</TableCell>
              <TableCell>{event.totalRecipients}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(event)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditEvent(event)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendMessage(event)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendMessage(event)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
