"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, MessageSquare, Users, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunicationEventsTable } from "./communication-events-table"
import { MessagesTable } from "./messages-table"
import { CommunicationEventModal } from "./communication-event-modal"
import { MessageModal } from "./message-modal"
import { type CommunicationEvent, useCommunication } from "@/hooks/use-communication"
import { CommunicationEventDetailsModal } from "./communication-event-details-modal"
import { useToast } from "@/hooks/use-toast"

export function CommunicationManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CommunicationEvent | null>(null)
  const {
    events,
    messages,
    stats,
    recipients,
    templates,
    loading,
    isSaving,
    error,
    loadRecipients,
    saveEvent,
    sendMessage,
    getEventDetails,
  } = useCommunication(debouncedSearchTerm)
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    if (!error) {
      return
    }

    toast({
      title: "Communication error",
      description: error,
      variant: "destructive",
    })
  }, [error, toast])

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleAddMessage = () => {
    setSelectedEvent(null)
    setIsMessageModalOpen(true)
  }

  const handleEditEvent = (event: CommunicationEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleSendMessage = (event: CommunicationEvent) => {
    setSelectedEvent(event)
    setIsMessageModalOpen(true)
  }

  const handleViewEventDetails = (event: CommunicationEvent) => {
    setSelectedEvent(event)
    setIsEventDetailsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
          <p className="text-muted-foreground">Send messages to members and manage communication events.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddMessage}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messages_sent.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.messages_sent.this_week ?? 0}</span> this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sms_credits.balance ?? "-"}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.sms_credits.available ? "Credits remaining" : "Balance unavailable"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_events.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">Communication events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_recipients.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.birthday_celebrants.count ?? 0} birthday celebrants this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Management</CardTitle>
          <CardDescription>Create communication events and send SMS to members, groups, committees, and celebrants.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events and message history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" disabled>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="events" className="w-full">
            <TabsList>
              <TabsTrigger value="events">Communication Events</TabsTrigger>
              <TabsTrigger value="messages">Message History</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="mt-6">
              <CommunicationEventsTable
                events={events}
                loading={loading}
                onEditEvent={handleEditEvent}
                onSendMessage={handleSendMessage}
                onViewDetails={handleViewEventDetails}
              />
            </TabsContent>
            <TabsContent value="messages" className="mt-6">
              <MessagesTable messages={messages} loading={loading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CommunicationEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        isSaving={isSaving}
        onSave={async (payload, eventId) => {
          const response = await saveEvent(payload, eventId)
          toast({
            title: eventId ? "Event updated" : "Event created",
            description: response.message,
          })
          setIsEventModalOpen(false)
        }}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        event={selectedEvent}
        recipients={recipients}
        templates={templates}
        isSaving={isSaving}
        loadRecipients={loadRecipients}
        onSend={async (payload) => {
          const response = await sendMessage(payload)
          toast({
            title: "SMS processed",
            description: response.message,
          })
          setIsMessageModalOpen(false)
        }}
      />

      <CommunicationEventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => setIsEventDetailsModalOpen(false)}
        event={selectedEvent}
        getEventDetails={getEventDetails}
      />
    </div>
  )
}
