"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Eye, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface FinanceEvent {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  budget: number
  expenses: number
  income: number
  status: "active" | "completed" | "planned"
}

interface FinanceEventsTableProps {
  events: FinanceEvent[]
  loading: boolean
  onEditEvent: (event: FinanceEvent) => void
}

export function FinanceEventsTable({ events, loading, onEditEvent }: FinanceEventsTableProps) {
  if (loading) {
    return <div className="text-center py-8">Loading financial events...</div>
  }

  const getNetAmount = (event: FinanceEvent) => {
    return event.income - event.expenses
  }

  const getBudgetProgress = (event: FinanceEvent) => {
    return event.budget > 0 ? (event.expenses / event.budget) * 100 : 0
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Net</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="font-medium">{event.name}</div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {event.startDate} - {event.endDate}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">${event.budget.toLocaleString()}</div>
                  <Progress value={getBudgetProgress(event)} className="h-1" />
                  <div className="text-xs text-muted-foreground">{getBudgetProgress(event).toFixed(1)}% used</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-red-600 font-medium">-${event.expenses.toLocaleString()}</div>
              </TableCell>
              <TableCell>
                <div className="text-green-600 font-medium">+${event.income.toLocaleString()}</div>
              </TableCell>
              <TableCell>
                <div className={`font-medium ${getNetAmount(event) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {getNetAmount(event) >= 0 ? "+" : ""}${getNetAmount(event).toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    event.status === "active" ? "default" : event.status === "completed" ? "secondary" : "outline"
                  }
                >
                  {event.status}
                </Badge>
              </TableCell>
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
                    <DropdownMenuItem onClick={() => onEditEvent(event)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Add Transaction
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
