import type { ActivityEvent, Timesheet, TimesheetDay, TimesheetEntryRow } from '@/types';

/** Legacy — used by dashboard activity cards only */
export const employeeWeek: TimesheetDay[] = [
  { day: 'Mon', date: 'Apr 21', hours: '8h 00m', project: 'Project Alpha', approved: true },
  { day: 'Tue', date: 'Apr 22', hours: '8h 00m', project: 'Project Alpha', approved: true },
  { day: 'Wed', date: 'Apr 23', hours: '7h 30m', project: 'Project Alpha', approved: true },
  { day: 'Thu', date: 'Apr 24', hours: '8h 00m', project: 'Project Beta', approved: false },
  { day: 'Fri', date: 'Apr 25', hours: '7h 15m', project: 'Project Beta', approved: false },
  { day: 'Sat', date: 'Apr 26', hours: '-', approved: false },
  { day: 'Sun', date: 'Apr 27', hours: '-', approved: false },
];

/** Builds a blank 7-day week starting from a Monday ISO date */
export function buildBlankWeek(weekStart: string): TimesheetEntryRow[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      day,
      hours: 0,
      otHours: 0,
      vacation: 0,
      sick: 0,
      fieldHours: 0,
      jobNumber: '',
      details: '',
    };
  });
}

/** Seed data — realistic filled week for the current mock employee */
export const mockWeekEntries: TimesheetEntryRow[] = [
  { date: '2025-05-19', day: 'Mon', hours: 8, otHours: 0, vacation: 0, sick: 0, fieldHours: 8, jobNumber: '2456', details: 'Worked on project planning and client meeting' },
  { date: '2025-05-20', day: 'Tue', hours: 8, otHours: 1, vacation: 0, sick: 0, fieldHours: 8, jobNumber: '2456', details: 'Data analysis and report preparation' },
  { date: '2025-05-21', day: 'Wed', hours: 8, otHours: 0, vacation: 0, sick: 0, fieldHours: 8, jobNumber: '2456', details: 'System testing and bug fixes' },
  { date: '2025-05-22', day: 'Thu', hours: 8, otHours: 0.5, vacation: 0, sick: 0, fieldHours: 8, jobNumber: '2456', details: 'Client follow-up and documentation' },
  { date: '2025-05-23', day: 'Fri', hours: 8, otHours: 0, vacation: 0, sick: 0, fieldHours: 8, jobNumber: '2456', details: 'Code review and deployment' },
  { date: '2025-05-24', day: 'Sat', hours: 0, otHours: 0, vacation: 0, sick: 0, fieldHours: 0, jobNumber: '', details: '' },
  { date: '2025-05-25', day: 'Sun', hours: 0, otHours: 0, vacation: 0, sick: 0, fieldHours: 0, jobNumber: '', details: '' },
];

export const timesheets: Timesheet[] = [
  {
    id: 'ts-001',
    employeeId: 'emp-001',
    weekStart: '2025-04-21',
    weekEnd: '2025-04-27',
    totalMinutes: 2325,
    status: 'submitted',
  },
  {
    id: 'ts-002',
    employeeId: 'emp-002',
    weekStart: '2025-04-21',
    weekEnd: '2025-04-27',
    totalMinutes: 2295,
    status: 'approved',
  },
  {
    id: 'ts-003',
    employeeId: 'emp-003',
    weekStart: '2025-04-21',
    weekEnd: '2025-04-27',
    totalMinutes: 2250,
    status: 'submitted',
  },
  {
    id: 'ts-004',
    employeeId: 'emp-005',
    weekStart: '2025-04-21',
    weekEnd: '2025-04-27',
    totalMinutes: 2400,
    status: 'approved',
  },
];

export const recentActivity: ActivityEvent[] = [
  {
    id: 'act-001',
    employeeId: 'emp-005',
    summary: 'submitted timesheet for Apr 21 - Apr 27, 2025',
    time: '2m ago',
    tone: 'orange',
  },
  {
    id: 'act-002',
    employeeId: 'emp-002',
    summary: 'requested time off for May 5 - May 9, 2025',
    time: '15m ago',
    tone: 'orange',
  },
  {
    id: 'act-003',
    employeeId: 'emp-003',
    summary: 'submitted timesheet for Apr 21 - Apr 27, 2025',
    time: '1h ago',
    tone: 'blue',
  },
  {
    id: 'act-004',
    employeeId: 'emp-006',
    summary: 'requested time off for Apr 28 - Apr 30, 2025',
    time: '2h ago',
    tone: 'purple',
  },
  {
    id: 'act-005',
    employeeId: 'emp-001',
    summary: 'had a time off request for May 20, 2025 approved',
    time: '1d ago',
    tone: 'green',
  },
];
