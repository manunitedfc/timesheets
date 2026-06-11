import { desktopTimesheetGrid, mobileTimesheetDays, timesheetTotals } from '@/components/app/mock-data';
import { formatWeekRange, getIsoWeekNumber } from '@/lib/timesheets/date-utils';
import { formatMinutesToTimeLabel, parseTimeLabelToMinutes } from '@/lib/timesheets/status-utils';
import type { TimesheetDay, TimesheetDayKey, TimesheetTotals, TimesheetWeek } from '@/types/timesheets';

const DAY_KEYS: TimesheetDayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

function createEmptyTotals(): TimesheetTotals {
  return {
    hours: '0.00',
    overtime: '0.00',
    vacation: '0.00',
    sick: '0.00',
    field: '0.00',
    mobileTotal: '0h 00m',
  };
}

function createDefaultDay(monday: Date, index: number): TimesheetDay {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);

  return {
    key: DAY_KEYS[index],
    short: DAY_SHORTS[index],
    full: DAY_FULL[index],
    mobile: {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      numericDate: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
      total: '0h 00m',
      hours: '0.00',
      overtime: '0.00',
      vacation: '0.00',
      sick: '0.00',
      field: '0.00',
      job: '',
      description: '',
    },
    desktop: {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: '0.00h',
      hours: '0.00',
      overtime: '0.00',
      vacation: '0.00',
      sick: '0.00',
      field: '0.00',
      job: '',
      description: '',
    },
  };
}

export function getMockTimesheetWeek(monday: Date, weekOffset: number): TimesheetWeek {
  const days = DAY_KEYS.map((_, index) => createDefaultDay(monday, index));

  if (weekOffset === 0) {
    mobileTimesheetDays.forEach((day, index) => {
      if (!days[index]) {
        return;
      }

      days[index].mobile = {
        date: day.date,
        numericDate: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
        }),
        total: day.total,
        hours: day.hours,
        overtime: day.overtime,
        vacation: day.vacation,
        sick: day.sick,
        field: day.field,
        job: day.job,
        description: day.description,
      };
    });
  }

  desktopTimesheetGrid.forEach((row, index) => {
    if (!days[index]) {
      return;
    }

    days[index].desktop = {
      date: row.date,
      total: `${(Number(row.hours) + Number(row.overtime)).toFixed(2)}h`,
      hours: row.hours,
      overtime: row.overtime,
      vacation: row.vacation,
      sick: row.sick,
      field: row.field,
      job: row.job,
      description: row.details,
    };
  });

  const totals = weekOffset === 0
    ? {
        ...timesheetTotals,
        mobileTotal: formatMinutesToTimeLabel(days.reduce((sum, day) => sum + parseTimeLabelToMinutes(day.mobile.total), 0)),
      }
    : createEmptyTotals();

  return {
    weekOffset,
    weekNumber: getIsoWeekNumber(monday),
    range: formatWeekRange(monday),
    days,
    totals,
  };
}
