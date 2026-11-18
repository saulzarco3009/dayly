/**
 * Date Utilities for DAYLY
 * Standardizes all date strings to YYYY-MM-DD local format
 */

export function getTodayStr(): string {
  const d = new Date();
  return formatDateToISO(d);
}

export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatLongDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function addDays(dateStr: string, days: number): string {
  const d = parseISODate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

export function getDaysDifference(targetDateStr: string, fromDateStr = getTodayStr()): number {
  const target = parseISODate(targetDateStr);
  const from = parseISODate(fromDateStr);
  const diffTime = target.getTime() - from.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayStr();
}

/**
 * Returns the Monday-to-Sunday dates for the week containing anchorDateStr
 */
export function getWeekDays(anchorDateStr: string): string[] {
  const d = parseISODate(anchorDateStr);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ...
  // Calculate difference to Monday (Monday = 1)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(formatDateToISO(current));
  }
  return days;
}

export interface CalendarDay {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Generates calendar grid for a given year and month (0-indexed month)
 * Starting on Monday
 */
export function getMonthDays(year: number, month: number): CalendarDay[] {
  const todayStr = getTodayStr();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week of 1st day (0 is Sun, 1 is Mon...)
  const firstDayWeekday = firstDayOfMonth.getDay();
  // Adjust so Monday is 0, Sunday is 6
  const leadingDaysCount = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const days: CalendarDay[] = [];

  // Previous month trailing days
  for (let i = leadingDaysCount; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    const dateStr = formatDateToISO(prevDate);
    days.push({
      dateStr,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  const totalDays = lastDayOfMonth.getDate();
  for (let day = 1; day <= totalDays; day++) {
    const curDate = new Date(year, month, day);
    const dateStr = formatDateToISO(curDate);
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days to complete full grid (multiple of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateStr = formatDateToISO(nextDate);
    days.push({
      dateStr,
      dayNumber: nextDate.getDate(),
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}
