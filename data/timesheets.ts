import type { ActivityEvent, Timesheet, TimesheetDay } from '@/types';

export const employeeWeek: TimesheetDay[] = [
  { day: 'Mon', date: 'Apr 21', hours: '8h 00m', project: 'Project Alpha', approved: true },
  { day: 'Tue', date: 'Apr 22', hours: '8h 00m', project: 'Project Alpha', approved: true },
  { day: 'Wed', date: 'Apr 23', hours: '7h 30m', project: 'Project Alpha', approved: true },
  { day: 'Thu', date: 'Apr 24', hours: '8h 00m', project: 'Project Beta', approved: false },
  { day: 'Fri', date: 'Apr 25', hours: '7h 15m', project: 'Project Beta', approved: false },
  { day: 'Sat', date: 'Apr 26', hours: '-', approved: false },
  { day: 'Sun', date: 'Apr 27', hours: '-', approved: false },
];

export const timesheets: Timesheet[] = [
  {
    id: 'ts-001',
    employeeId: 'emp-001',
    employeeName: 'John Doe',
    period: 'Apr 21 - Apr 27, 2025',
    totalHours: '38h 45m',
    status: 'pending',
  },
  {
    id: 'ts-002',
    employeeId: 'emp-002',
    employeeName: 'Jane Smith',
    period: 'Apr 21 - Apr 27, 2025',
    totalHours: '38h 15m',
    status: 'approved',
  },
  {
    id: 'ts-003',
    employeeId: 'emp-003',
    employeeName: 'Mike Johnson',
    period: 'Apr 21 - Apr 27, 2025',
    totalHours: '37h 30m',
    status: 'pending',
  },
  {
    id: 'ts-004',
    employeeId: 'emp-005',
    employeeName: 'David Brown',
    period: 'Apr 21 - Apr 27, 2025',
    totalHours: '40h 00m',
    status: 'approved',
  },
];

export const recentActivity: ActivityEvent[] = [
  {
    id: 'act-001',
    message: 'David Brown submitted timesheet for Apr 21 - Apr 27, 2025',
    time: '2m ago',
    tone: 'orange',
  },
  {
    id: 'act-002',
    message: 'Jane Smith requested time off for May 5 - May 9, 2025',
    time: '15m ago',
    tone: 'orange',
  },
  {
    id: 'act-003',
    message: 'Mike Johnson submitted timesheet for Apr 21 - Apr 27, 2025',
    time: '1h ago',
    tone: 'blue',
  },
  {
    id: 'act-004',
    message: 'Emily Davis requested time off for Apr 28 - Apr 30, 2025',
    time: '2h ago',
    tone: 'purple',
  },
  {
    id: 'act-005',
    message: 'Your time off request for May 20, 2025 was approved',
    time: '1d ago',
    tone: 'green',
  },
];
