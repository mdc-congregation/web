"use client"

import { formatDate } from "@/utils/date-helpers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cake, ChevronLeft, ChevronRight, Phone } from "lucide-react"

interface UpcomingBirthdaysProps {
  weekLabel?: string
  birthdays: Array<{
    id: string
    name: string
    date_of_birth: string | null
    phone_number: string | null
    birthday_date: string
    birthday_day: string
  }>
  loading: boolean
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export function UpcomingBirthdays({
  weekLabel,
  birthdays,
  loading,
  onPreviousWeek,
  onNextWeek,
}: UpcomingBirthdaysProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{weekLabel ?? "This Week"}</p>
          <p className="text-xs text-muted-foreground">Sunday to Saturday birthdays</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onPreviousWeek} disabled={loading}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextWeek} disabled={loading}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Loading birthdays...</div>
      ) : birthdays.length === 0 ? (
        <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          No birthdays found for this week.
        </div>
      ) : (
        <div className="space-y-3">
          {birthdays.map((birthday) => (
            <div key={birthday.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Cake className="h-4 w-4 text-primary" />
                    <p className="font-medium">{birthday.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {birthday.birthday_day}, {formatDate(birthday.birthday_date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    DOB: {birthday.date_of_birth ?? "Not provided"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{birthday.phone_number || "No phone number"}</span>
                  </div>
                </div>
                <Badge variant="secondary">{birthday.birthday_day}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
