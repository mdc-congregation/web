"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Filter, Download, Calendar, Users, Clock, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServicesTable } from "./services-table"
import { ServiceModal } from "./service-modal"
import { AttendanceTable } from "./attendance-table"
import { useServices } from "@/hooks/use-services"
import { AttendanceModal } from "./attendance-modal"
import { ServiceNotificationModal } from "./service-notification-modal"
import { ServiceDetailsModal } from "./service-details-modal"

export function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const { services, attendance, loading } = useServices()

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedServiceForAction, setSelectedServiceForAction] = useState(null)

  const handleAddService = () => {
    setSelectedService(null)
    setIsServiceModalOpen(true)
  }

  const handleEditService = (service: any) => {
    setSelectedService(service)
    setIsServiceModalOpen(true)
  }

  const handleRecordAttendance = (service: any) => {
    setSelectedServiceForAction(service)
    setIsAttendanceModalOpen(true)
  }

  const handleSendNotification = (service: any) => {
    setSelectedServiceForAction(service)
    setIsNotificationModalOpen(true)
  }

  const handleViewDetails = (service: any) => {
    setSelectedServiceForAction(service)
    setIsDetailsModalOpen(true)
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.preacher.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage church services, events, and attendance tracking.</p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <CardDescription>Schedule services, track attendance, and manage events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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

          <Tabs defaultValue="services" className="w-full">
            <TabsList>
              <TabsTrigger value="services">Services & Events</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-6">
              <ServicesTable
                services={filteredServices}
                loading={loading}
                onEditService={handleEditService}
                onRecordAttendance={handleRecordAttendance}
                onSendNotification={handleSendNotification}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
            <TabsContent value="attendance" className="mt-6">
              <AttendanceTable attendance={attendance} loading={loading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        service={selectedServiceForAction}
      />

      <ServiceNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        service={selectedServiceForAction}
      />

      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        service={selectedServiceForAction}
      />
    </div>
  )
}
