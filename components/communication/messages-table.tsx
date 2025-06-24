"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Users, User } from "lucide-react"

interface Message {
  id: string
  subject: string
  type: "email" | "sms"
  recipientType: "group" | "individual"
  recipientCount: number
  sentDate: string
  status: "sent" | "delivered" | "failed" | "pending"
  eventTitle?: string
}

interface MessagesTableProps {
  messages: Message[]
  loading: boolean
}

export function MessagesTable({ messages, loading }: MessagesTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "default"
      case "delivered":
        return "secondary"
      case "failed":
        return "destructive"
      case "pending":
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
            <TableHead>Message</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Sent Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <div className="font-medium">{message.subject}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {message.type === "email" ? (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="capitalize">{message.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {message.recipientType === "group" ? (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>
                    {message.recipientCount} {message.recipientType === "group" ? "members" : "person"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{message.eventTitle || "-"}</TableCell>
              <TableCell>{message.sentDate}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(message.status)}>{message.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
