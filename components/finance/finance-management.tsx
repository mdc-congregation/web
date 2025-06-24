"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, Download, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinanceEventsTable } from "./finance-events-table"
import { DonationsTable } from "./donations-table"
import { FinanceEventModal } from "./finance-event-modal"
import { DonationModal } from "./donation-modal"
import { useFinance } from "@/hooks/use-finance"

export function FinanceManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const { financeEvents, donations, loading } = useFinance()

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleAddDonation = () => {
    setSelectedDonation(null)
    setIsDonationModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleEditDonation = (donation: any) => {
    setSelectedDonation(donation)
    setIsDonationModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">Manage donations, tithes, and financial events.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddDonation}>
            <Plus className="mr-2 h-4 w-4" />
            Add Donation
          </Button>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Financial Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tithes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,500</div>
            <p className="text-xs text-muted-foreground">75% of total income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offerings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,080</div>
            <p className="text-xs text-muted-foreground">25% of total income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Financial events running</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
          <CardDescription>Track donations, tithes, and financial events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="events" className="w-full">
            <TabsList>
              <TabsTrigger value="events">Financial Events</TabsTrigger>
              <TabsTrigger value="donations">Donations & Tithes</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="mt-6">
              <FinanceEventsTable events={financeEvents} loading={loading} onEditEvent={handleEditEvent} />
            </TabsContent>
            <TabsContent value="donations" className="mt-6">
              <DonationsTable donations={donations} loading={loading} onEditDonation={handleEditDonation} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FinanceEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={selectedEvent} />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  )
}
