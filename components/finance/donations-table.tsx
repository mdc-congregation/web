"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Donation {
  id: string
  donor: string
  amount: number
  type: "tithe" | "offering" | "special"
  method: "cash" | "check" | "online" | "card"
  date: string
  notes?: string
}

interface DonationsTableProps {
  donations: Donation[]
  loading: boolean
  onEditDonation: (donation: Donation) => void
}

export function DonationsTable({ donations, loading, onEditDonation }: DonationsTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading donations...</div>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tithe":
        return "Tithe"
      case "offering":
        return "Offering"
      case "special":
        return "Special Donation"
      default:
        return type
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="font-medium">{donation.donor}</TableCell>
              <TableCell className="font-medium text-green-600">${donation.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    donation.type === "tithe" ? "default" : donation.type === "offering" ? "secondary" : "outline"
                  }
                >
                  {getTypeLabel(donation.type)}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{donation.method}</TableCell>
              <TableCell>{donation.date}</TableCell>
              <TableCell>{donation.notes || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditDonation(donation)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
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
