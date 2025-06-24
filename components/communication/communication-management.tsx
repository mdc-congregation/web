"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, MessageSquare, Users, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunicationEventsTable } from "./communication-events-table"
import { MessagesTable } from "./messages-table"
import { CommunicationEventModal } from "./communication-event-modal"
import { MessageModal } from "./message-modal"
import { useCommunication } from "@/hooks/use-communication"
import { CommunicationEventDetailsModal } from "./communication-event-details-modal"

export function CommunicationManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const { events, messages, loading } = useCommunication()
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false)

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleAddMessage = () => {
    setSelectedMessage(null)
    setIsMessageModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleSendMessage = (event: any) => {
    setSelectedEvent(event)
    setSelectedMessage(null)
    setIsMessageModalOpen(true)
  }

  const handleViewEventDetails = (event: any) => {
    setSelectedEvent(event)
    setIsEventDetailsModalOpen(true)
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23</span> this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">Credits remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Communication events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">Registered contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Management</CardTitle>
          <CardDescription>Create events and send messages to members and external contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events and messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
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
                events={filteredEvents}
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
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={selectedMessage}
        event={selectedEvent}
      />

      <CommunicationEventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => setIsEventDetailsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  )
}
