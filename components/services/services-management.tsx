"use client"

import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ServicesManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const {
    services,
    attendance,
    stats,
    pagination,
    memberOptions,
    loading,
    isSaving,
    error,
    saveService,
    updateAttendance,
    sendNotification,
    deleteService,
  } = useServices(debouncedSearchTerm, page, perPage)

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedServiceForAction, setSelectedServiceForAction] = useState(null)
  const [servicePendingDelete, setServicePendingDelete] = useState<any | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, perPage])

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

  const handleDeleteService = async () => {
    if (!servicePendingDelete) {
      return
    }

    try {
      const message = await deleteService(servicePendingDelete.id)
      toast({
        title: "Service deleted",
        description: message,
      })
      setServicePendingDelete(null)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Unable to delete service.",
      })
    }
  }

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

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.scheduled_services.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.scheduled_services.percentage_of_total}% of total services` : "Loading..."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendance_this_week.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.attendance_this_week.percentage_increase}% from comparison period` : "Loading..."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_services.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.total_services.percentage_increase}% growth` : "Loading..."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcoming_services ?? 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled and ongoing</p>
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
            <select
              value={String(perPage)}
              onChange={(event) => setPerPage(Number(event.target.value))}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
              <option value="100">100 rows</option>
            </select>
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
                services={services}
                loading={loading}
                onEditService={handleEditService}
                onRecordAttendance={handleRecordAttendance}
                onSendNotification={handleSendNotification}
                onViewDetails={handleViewDetails}
                onDeleteService={setServicePendingDelete}
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                total={pagination.total}
                from={pagination.from}
                to={pagination.to}
                onPageChange={setPage}
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
        memberOptions={memberOptions}
        onSave={saveService}
        isSaving={isSaving}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        service={selectedServiceForAction}
        onSave={updateAttendance}
        isSaving={isSaving}
      />

      <ServiceNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        service={selectedServiceForAction}
        onSend={sendNotification}
        isSaving={isSaving}
      />

      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        service={selectedServiceForAction}
      />

      <AlertDialog open={Boolean(servicePendingDelete)} onOpenChange={(open) => !open && setServicePendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium text-foreground">{servicePendingDelete?.title}</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDeleteService()} disabled={isSaving}>
              {isSaving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
