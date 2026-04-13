"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Trash2, Users, Pencil, Link2, Eye } from "lucide-react"
import { useFamilies, type FamilyListItem } from "@/hooks/use-families"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/utils/date-helpers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FamilyManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [editingFamily, setEditingFamily] = useState<FamilyListItem | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<FamilyListItem | null>(null)
  const [familyPendingDelete, setFamilyPendingDelete] = useState<FamilyListItem | null>(null)
  const [familyName, setFamilyName] = useState("")
  const [memberLookup, setMemberLookup] = useState("")

  const {
    families,
    memberOptions,
    loading,
    isSaving,
    error,
    stats,
    pagination,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamily,
    addMembers,
    removeMember,
  } = useFamilies(debouncedSearchTerm, page, perPage)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, perPage])

  const availableMemberOptions = useMemo(() => {
    const selectedIds = new Set(selectedFamily?.members.map((member) => member.id) ?? [])

    return memberOptions.filter((member) => !selectedIds.has(member.id))
  }, [memberOptions, selectedFamily])

  const memberDatalistId = "family-member-options"

  const openCreateDialog = () => {
    setEditingFamily(null)
    setFamilyName("")
    setIsEditorOpen(true)
  }

  const openEditDialog = (family: FamilyListItem) => {
    setEditingFamily(family)
    setFamilyName(family.name)
    setIsEditorOpen(true)
  }

  const openDetailsDialog = async (family: FamilyListItem) => {
    const freshFamily = await getFamily(family.id)
    setSelectedFamily(freshFamily)
    setMemberLookup("")
    setIsDetailsOpen(true)
  }

  const handleSaveFamily = async () => {
    try {
      const trimmedName = familyName.trim()
      if (!trimmedName) {
        throw new Error("Family name is required.")
      }

      const response = editingFamily
        ? await updateFamily(editingFamily.id, trimmedName)
        : await createFamily(trimmedName)

      toast({
        title: editingFamily ? "Family updated" : "Family created",
        description: response.message,
      })
      setIsEditorOpen(false)
    } catch (err) {
      toast({
        variant: "destructive",
        title: editingFamily ? "Update failed" : "Creation failed",
        description: err instanceof Error ? err.message : "Unable to save family.",
      })
    }
  }

  const handleDeleteFamily = async (family: FamilyListItem) => {
    try {
      const message = await deleteFamily(family.id)
      toast({
        title: "Family deleted",
        description: message,
      })
      if (selectedFamily?.id === family.id) {
        setIsDetailsOpen(false)
        setSelectedFamily(null)
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Unable to delete family.",
      })
    } finally {
      setIsDeleteConfirmOpen(false)
      setFamilyPendingDelete(null)
    }
  }

  const openDeleteConfirm = (family: FamilyListItem) => {
    setFamilyPendingDelete(family)
    setIsDeleteConfirmOpen(true)
  }

  const handleAddMember = async () => {
    if (!selectedFamily) {
      return
    }

    try {
      const matchedMember = availableMemberOptions.find((member) => {
        const label = member.phone ? `${member.name} (${member.phone})` : member.name
        return label === memberLookup || member.name === memberLookup
      })

      if (!matchedMember) {
        throw new Error("Select a valid member from the list.")
      }

      const response = await addMembers(selectedFamily.id, [matchedMember.id])
      setSelectedFamily(response.family)
      setMemberLookup("")
      toast({
        title: "Member linked",
        description: response.message,
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Link failed",
        description: err instanceof Error ? err.message : "Unable to link member.",
      })
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedFamily) {
      return
    }

    try {
      const message = await removeMember(selectedFamily.id, memberId)
      const freshFamily = await getFamily(selectedFamily.id)
      setSelectedFamily(freshFamily)
      toast({
        title: "Member removed",
        description: message,
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Removal failed",
        description: err instanceof Error ? err.message : "Unable to remove member.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Families</h1>
          <p className="text-muted-foreground">Manage family records and member links.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Family
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_families.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.total_families.new_this_month ?? 0} added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Members</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.linked_members.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg {stats?.linked_members.average_per_family ?? 0} members per family
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_families.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.active_families.percentage ?? 0}% have members linked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empty Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.empty_families.count ?? 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.empty_families.percentage ?? 0}% still need members linked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Directory</CardTitle>
          <CardDescription>Create, edit, view, and manage family members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPage(1)
                }}
                placeholder="Search families..."
                className="pl-8"
              />
            </div>
            <Select value={String(perPage)} onValueChange={(value) => setPerPage(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="20">20 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
                <SelectItem value="100">100 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Family Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Loading families...
                    </TableCell>
                  </TableRow>
                ) : families.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No families found.
                    </TableCell>
                  </TableRow>
                ) : (
                  families.map((family) => (
                    <TableRow key={family.id}>
                      <TableCell className="font-medium">{family.name}</TableCell>
                      <TableCell>{family.memberCount}</TableCell>
                      <TableCell>{family.createdAt ? formatDate(family.createdAt) : "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => void openDetailsDialog(family)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(family)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => openDeleteConfirm(family)} disabled={isSaving}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {pagination.total > 0
                  ? `Showing ${pagination.from} to ${pagination.to} of ${pagination.total} families`
                  : "No families found"}
              </p>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.currentPage > 1) {
                          setPage(pagination.currentPage - 1)
                        }
                      }}
                      className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.currentPage < pagination.lastPage) {
                          setPage(pagination.currentPage + 1)
                        }
                      }}
                      className={pagination.currentPage >= pagination.lastPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFamily ? "Edit Family" : "Create Family"}</DialogTitle>
            <DialogDescription>Save the family record using the API family endpoints.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="family-name">Family Name</Label>
            <Input
              id="family-name"
              value={familyName}
              onChange={(event) => setFamilyName(event.target.value)}
              placeholder="Enter family name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSaveFamily()} disabled={isSaving}>
              {isSaving ? "Saving..." : editingFamily ? "Update Family" : "Create Family"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Family</DialogTitle>
            <DialogDescription>
              This action will permanently delete the family record
              {familyPendingDelete ? ` for "${familyPendingDelete.name}"` : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Confirm before continuing. This cannot be undone from the web app.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false)
                setFamilyPendingDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => familyPendingDelete && void handleDeleteFamily(familyPendingDelete)}
              disabled={isSaving || !familyPendingDelete}
            >
              {isSaving ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFamily?.name ?? "Family Details"}</DialogTitle>
            <DialogDescription>View linked members and manage family membership.</DialogDescription>
          </DialogHeader>

          {selectedFamily && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Family Name</CardTitle>
                  </CardHeader>
                  <CardContent>{selectedFamily.name}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Members</CardTitle>
                  </CardHeader>
                  <CardContent>{selectedFamily.memberCount}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Created</CardTitle>
                  </CardHeader>
                  <CardContent>{selectedFamily.createdAt ? formatDate(selectedFamily.createdAt) : "-"}</CardContent>
                </Card>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <h3 className="font-medium">Add Member</h3>
                </div>
                <div className="flex gap-3">
                  <Input
                    list={memberDatalistId}
                    value={memberLookup}
                    onChange={(event) => setMemberLookup(event.target.value)}
                    placeholder="Search member name"
                  />
                  <datalist id={memberDatalistId}>
                    {availableMemberOptions.map((member) => (
                      <option key={member.id} value={member.phone ? `${member.name} (${member.phone})` : member.name} />
                    ))}
                  </datalist>
                  <Button onClick={() => void handleAddMember()} disabled={isSaving}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <h3 className="font-medium">Linked Members</h3>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[110px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFamily.members.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No members linked yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedFamily.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.phone || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{member.status || "unknown"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleRemoveMember(member.id)}
                                disabled={isSaving}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
