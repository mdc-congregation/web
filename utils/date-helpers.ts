import { format, parseISO, isValid, startOfWeek, endOfWeek, subDays } from "date-fns"

export const formatDate = (date: string | Date, formatString = "MMM dd, yyyy"): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatString) : "Invalid Date"
  } catch {
    return "Invalid Date"
  }
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, "MMM dd, yyyy HH:mm")
}

export const getWeekRange = (date: Date = new Date()) => {
  return {
    start: startOfWeek(date),
    end: endOfWeek(date),
  }
}

export const getDateRange = (days: number, from: Date = new Date()) => {
  return {
    start: subDays(from, days),
    end: from,
  }
}

export const isToday = (date: string | Date): boolean => {
  const today = new Date()
  const checkDate = typeof date === "string" ? parseISO(date) : date
  return format(today, "yyyy-MM-dd") === format(checkDate, "yyyy-MM-dd")
}
