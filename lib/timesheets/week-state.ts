import { formatMinutesToTimeLabel } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayEntry, TimesheetTotals, TimesheetWeek } from '@/types/timesheets';

export function parseDecimal(value: string): number {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
}

function formatDecimal(value: number): string {
  return value.toFixed(2);
}

function getDayTotalHours(day: TimesheetDay): number {
  return (
    parseDecimal(day.entry.hours) +
    parseDecimal(day.entry.overtime) +
    parseDecimal(day.entry.vacation) +
    parseDecimal(day.entry.sick)
  );
}

function formatDesktopDayTotal(day: TimesheetDay): string {
  return `${getDayTotalHours(day).toFixed(2)}h`;
}

function formatMobileDayTotal(day: TimesheetDay): string {
  return formatMinutesToTimeLabel(Math.round(getDayTotalHours(day) * 60));
}

function recalculateTotals(days: TimesheetDay[]): TimesheetTotals {
  const totals = days.reduce(
    (acc, day) => {
      acc.hours += parseDecimal(day.entry.hours);
      acc.overtime += parseDecimal(day.entry.overtime);
      acc.vacation += parseDecimal(day.entry.vacation);
      acc.sick += parseDecimal(day.entry.sick);
      return acc;
    },
    { hours: 0, overtime: 0, vacation: 0, sick: 0 }
  );

  const totalMinutes = Math.round((totals.hours + totals.overtime + totals.vacation + totals.sick) * 60);
  const totalHours = totals.hours + totals.overtime + totals.vacation + totals.sick;

  return {
    totalHours: formatDecimal(totalHours),
    hours: formatDecimal(totals.hours),
    overtime: formatDecimal(totals.overtime),
    vacation: formatDecimal(totals.vacation),
    sick: formatDecimal(totals.sick),
    mobileTotal: formatMinutesToTimeLabel(totalMinutes),
  };
}

export function syncTimesheetWeek(week: TimesheetWeek): TimesheetWeek {
  const days = week.days.map((day) => ({
    ...day,
    totals: {
      mobile: formatMobileDayTotal(day),
      desktop: formatDesktopDayTotal(day),
    },
  }));

  return {
    ...week,
    days,
    totals: recalculateTotals(days),
  };
}

export function createEmptyEntry(): TimesheetDayEntry {
  return {
    hours: '0.00',
    overtime: '0.00',
    vacation: '0.00',
    sick: '0.00',
    field: false,
    job: '',
    description: '',
  };
}

export function clearTimesheetDayEntry(day: TimesheetDay): TimesheetDay {
  return {
    ...day,
    entry: createEmptyEntry(),
  };
}

export function copyTimesheetDayEntry(targetDay: TimesheetDay, sourceDay: TimesheetDay): TimesheetDay {
  return {
    ...targetDay,
    entry: {
      ...sourceDay.entry,
    },
  };
}
