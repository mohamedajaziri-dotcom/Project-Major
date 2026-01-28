import { startOfWeek, differenceInYears, differenceInDays, differenceInHours, addYears } from 'date-fns';
import { LifeStats } from './types';

/**
 * Get the start of the week (Monday) for a given date
 * @param date The date to get the week start for
 * @param timezone Timezone (not used in simple impl, but kept for API compatibility)
 */
export function getWeekStart(date: Date = new Date(), timezone: string = "Europe/London"): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday = 1
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format datetime as ISO string
 */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Suggest session context based on current time
 */
export function suggestSessionContext(date: Date = new Date()): "work" | "evening" | "weekend" {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = date.getHours();
  
  // Weekend (Saturday = 6, Sunday = 0)
  if (day === 0 || day === 6) {
    return "weekend";
  }
  
  // Weekday
  if (hour >= 9 && hour < 17) {
    return "work";
  }
  
  return "evening";
}

/**
 * Calculate life statistics based on birthdate and expected death age
 */
export function calculateLifeStats(
  birthdate: Date,
  expectedDeathAge: number = 80,
  currentDate: Date = new Date()
): LifeStats {
  const currentAge = differenceInYears(currentDate, birthdate);
  const deathDate = addYears(birthdate, expectedDeathAge);
  
  const remainingYears = expectedDeathAge - currentAge;
  const remainingDays = differenceInDays(deathDate, currentDate);
  const remainingHours = differenceInHours(deathDate, currentDate);
  
  // Calculate sleep, work, and free time
  // Assumptions:
  // - 8 hours sleep per day = 8 * 365.25 * remainingYears
  // - Work: Mon-Fri 9-17 = 8h * 5 days = 40h/week = 40 * 52 weeks * remainingYears
  // - Free time = total - sleep - work
  
  const hoursPerYear = 365.25 * 24;
  const totalRemainingHours = remainingYears * hoursPerYear;
  
  const sleepHoursPerYear = 365.25 * 8;
  const remainingSleep = remainingYears * sleepHoursPerYear;
  
  const workHoursPerYear = 40 * 52; // 40h/week * 52 weeks
  const remainingWork = remainingYears * workHoursPerYear;
  
  const remainingFree = totalRemainingHours - remainingSleep - remainingWork;
  
  // Weekly calculations
  const weeklyWorkHours = 40; // Mon-Fri 9-17
  const weeklySleepHours = 7 * 8; // 56 hours
  const weeklyTotalHours = 7 * 24; // 168 hours
  const weeklyFreeHours = weeklyTotalHours - weeklySleepHours - weeklyWorkHours;
  
  return {
    birthdate,
    currentAge,
    expectedDeathAge,
    remainingYears,
    remainingDays,
    remainingHours,
    remainingSleep,
    remainingWork,
    remainingFree,
    weeklyFreeHours,
    weeklyWorkHours,
  };
}

/**
 * Calculate streak of consecutive days with at least one HL session
 */
export function calculateStreak(daysWithHL: Date[]): number {
  if (daysWithHL.length === 0) return 0;
  
  // Sort dates descending
  const sorted = [...daysWithHL].sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sorted.length; i++) {
    const checkDate = new Date(sorted[i]);
    checkDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if a datetime falls within work hours (Mon-Fri 9-17)
 */
export function isWorkHours(date: Date): boolean {
  const day = date.getDay();
  const hour = date.getHours();
  
  // Not weekend
  if (day === 0 || day === 6) return false;
  
  // Within 9-17
  return hour >= 9 && hour < 17;
}
