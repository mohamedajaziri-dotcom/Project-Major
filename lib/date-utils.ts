import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { startOfWeek, endOfWeek, format, parseISO, addDays } from 'date-fns'

const TIMEZONE = 'Europe/London'

/**
 * Get the start of the week (Monday 00:00) in Europe/London timezone
 * @param date - Optional date, defaults to now
 * @returns Date object representing Monday 00:00 in Europe/London
 */
export function getWeekStart(date: Date = new Date()): Date {
  // Convert to London timezone
  const londonDate = utcToZonedTime(date, TIMEZONE)
  
  // Get start of week (Monday) in London timezone
  const weekStart = startOfWeek(londonDate, { weekStartsOn: 1 })
  
  // Convert back to UTC
  return zonedTimeToUtc(weekStart, TIMEZONE)
}

/**
 * Get the end of the week (Sunday 23:59:59.999) in Europe/London timezone
 * @param date - Optional date, defaults to now
 * @returns Date object representing Sunday 23:59:59.999 in Europe/London
 */
export function getWeekEnd(date: Date = new Date()): Date {
  // Convert to London timezone
  const londonDate = utcToZonedTime(date, TIMEZONE)
  
  // Get end of week (Sunday) in London timezone
  const weekEnd = endOfWeek(londonDate, { weekStartsOn: 1 })
  
  // Convert back to UTC
  return zonedTimeToUtc(weekEnd, TIMEZONE)
}

/**
 * Format a date as YYYY-MM-DD
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Parse a YYYY-MM-DD date string
 * @param dateString - Date string to parse
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString)
}

/**
 * Get the week start date for a given date string
 * @param dateString - YYYY-MM-DD date string
 * @returns Date object for the Monday of that week
 */
export function getWeekStartFromString(dateString: string): Date {
  const date = parseDate(dateString)
  return getWeekStart(date)
}

/**
 * Check if a date is in the current week
 * @param date - Date to check
 * @returns True if the date is in the current week
 */
export function isCurrentWeek(date: Date): boolean {
  const now = new Date()
  const currentWeekStart = getWeekStart(now)
  const currentWeekEnd = getWeekEnd(now)
  
  return date >= currentWeekStart && date <= currentWeekEnd
}

/**
 * Get date for today in Europe/London timezone
 * @returns Date string in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date()
  const londonDate = utcToZonedTime(now, TIMEZONE)
  return formatDate(londonDate)
}
