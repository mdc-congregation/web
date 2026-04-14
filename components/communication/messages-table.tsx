"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Cake, MessageSquare, Users, User } from "lucide-react"
import type { CommunicationMessage } from "@/hooks/use-communication"

interface MessagesTableProps {
  messages: CommunicationMessage[]
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
      case "partial":
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
          {messages.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No SMS history found.
              </TableCell>
            </TableRow>
          )}
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{message.subject}</div>
                  <div className="line-clamp-2 text-sm text-muted-foreground">{message.content}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>SMS</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {message.recipientType === "birthday_celebrants" ? (
                    <Cake className="h-4 w-4 text-muted-foreground" />
                  ) : message.recipientType === "groups" || message.recipientType === "all_members" ? (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{message.recipientTypeLabel}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{message.recipientCount} recipients</div>
                {message.personalized && (
                  <div className="mt-1 text-xs text-muted-foreground">Personalized with name</div>
                )}
                {message.includeGuests && (
                  <div className="mt-1 text-xs text-muted-foreground">Guests included</div>
                )}
              </TableCell>
              <TableCell>{message.eventTitle || "-"}</TableCell>
              <TableCell>{message.status === "pending" ? message.scheduledForLabel || message.sentDateLabel : message.sentDateLabel}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(message.status)}>{message.status}</Badge>
                {message.failedCount > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {message.successCount} sent, {message.failedCount} failed
                  </div>
                )}
                {message.failedCount === 0 && message.successCount > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">{message.successCount} sent successfully</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
