import type { WeekPickerOption } from '@/types/timesheets';

export function getWeekMonday(offset: number): Date {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(monday)} - ${fmt(sunday)}, ${sunday.getFullYear()}`;
}

export function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getMonthName(monthIndex: number): string {
  return new Date(2026, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' });
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function getWeekOffsetFromMonday(monday: Date): number {
  return Math.round((monday.getTime() - getWeekMonday(0).getTime()) / 604800000);
}

export function getWeeksForMonth(date: Date): WeekPickerOption[] {
  const monthStart = getMonthStart(date);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstWeekMonday = new Date(monthStart);
  const startDow = firstWeekMonday.getDay();
  firstWeekMonday.setDate(firstWeekMonday.getDate() - (startDow === 0 ? 6 : startDow - 1));
  firstWeekMonday.setHours(0, 0, 0, 0);
  const weeks: WeekPickerOption[] = [];

  for (let cursor = new Date(firstWeekMonday); cursor <= monthEnd || weeks.length === 0; cursor.setDate(cursor.getDate() + 7)) {
    const monday = new Date(cursor);
    weeks.push({
      offset: getWeekOffsetFromMonday(monday),
      label: `Week ${getIsoWeekNumber(monday)}`,
      range: formatWeekRange(monday),
    });
  }

  return weeks;
}

export function getIsoWeekNumber(date: Date): number {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));

  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
}
