/**
 * Utilidades de Fechas para DAYLY (en español)
 * Estandariza cadenas de fecha en formato local YYYY-MM-DD
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
  const formatted = d.toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatLongDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseISODate(dateStr);
  const formatted = d.toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatMonthYear(date: Date): string {
  const formatted = date.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
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
 * Devuelve las fechas de lunes a domingo para la semana que contiene anchorDateStr
 */
export function getWeekDays(anchorDateStr: string): string[] {
  const d = parseISODate(anchorDateStr);
  const dayOfWeek = d.getDay(); // 0 es Domingo, 1 es Lunes...
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
 * Genera la cuadrícula del calendario mensual empezando en lunes
 */
export function getMonthDays(year: number, month: number): CalendarDay[] {
  const todayStr = getTodayStr();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstDayWeekday = firstDayOfMonth.getDay();
  // Lunes es 0, Domingo es 6
  const leadingDaysCount = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  const days: CalendarDay[] = [];

  // Días del mes anterior
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

  // Días del mes actual
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

  // Días del mes siguiente para completar la cuadrícula
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
