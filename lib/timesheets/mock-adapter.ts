import { desktopTimesheetGrid, mobileTimesheetDays } from '@/components/app/mock-data';
import { formatWeekRange, getIsoWeekNumber } from '@/lib/timesheets/date-utils';
import { createEmptyEntry, syncTimesheetWeek } from '@/lib/timesheets/week-state';
import type { TimesheetDay, TimesheetDayEntry, TimesheetDayKey, TimesheetWeek } from '@/types/timesheets';

const DAY_KEYS: TimesheetDayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

function createEntryFromMobileDay(index: number): TimesheetDayEntry {
  const day = mobileTimesheetDays[index];
  if (!day) {
    return createEmptyEntry();
  }

  return {
    hours: day.hours,
    overtime: day.overtime,
    vacation: day.vacation,
    sick: day.sick,
    field: day.field,
    job: day.job,
    description: day.description,
  };
}

function createEntryFromDesktopRow(index: number): TimesheetDayEntry {
  const row = desktopTimesheetGrid[index];
  if (!row) {
    return createEmptyEntry();
  }

  return {
    hours: row.hours,
    overtime: row.overtime,
    vacation: row.vacation,
    sick: row.sick,
    field: row.field,
    job: row.job,
    description: row.details,
  };
}

function createEntryForOffset(index: number, weekOffset: number): TimesheetDayEntry {
  if (weekOffset === 0) {
    return createEntryFromMobileDay(index);
  }

  if (weekOffset < 0) {
    return createEntryFromDesktopRow(index);
  }

  return createEmptyEntry();
}

function createDay(monday: Date, index: number, weekOffset: number): TimesheetDay {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);

  return {
    key: DAY_KEYS[index],
    short: DAY_SHORTS[index],
    full: DAY_FULL[index],
    mobile: {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      numericDate: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
    },
    desktop: {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    entry: createEntryForOffset(index, weekOffset),
    totals: {
      mobile: '0h 00m',
      desktop: '0.00h',
    },
  };
}

export function getMockTimesheetWeek(monday: Date, weekOffset: number): TimesheetWeek {
  const baseWeek: TimesheetWeek = {
    weekOffset,
    weekNumber: getIsoWeekNumber(monday),
    range: formatWeekRange(monday),
    status: weekOffset < 0 ? 'submitted' : 'draft',
    days: DAY_KEYS.map((_, index) => createDay(monday, index, weekOffset)),
    totals: {
      hours: '0.00',
      overtime: '0.00',
      vacation: '0.00',
      sick: '0.00',
      field: '0.00',
      mobileTotal: '0h 00m',
    },
  };

  return syncTimesheetWeek(baseWeek);
}
