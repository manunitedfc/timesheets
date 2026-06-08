import { approvals } from '@/data/approvals';
import { CURRENT_EMPLOYEE_ID, currentManager } from '@/data/currentUser';
import { employees } from '@/data/employees';
import { employeeWeek, recentActivity, timesheets } from '@/data/timesheets';
import { timeOffBalances, timeOffRequests } from '@/data/timeoff';
import type { ActivityFeedItem, Approval, Employee, Timesheet } from '@/types';

export type TimesheetRow = Timesheet & {
  employee: Employee | undefined;
  employeeName: string;
  initials: string;
  period: string;
  totalHours: string;
};

export type ApprovalRow = Approval & {
  employee: Employee | undefined;
  employeeName: string;
  initials: string;
  role: string;
};

const monthDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const monthDayYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function parseIsoDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function getEmployeeById(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId);
}

export function getCurrentEmployee() {
  return getEmployeeById(CURRENT_EMPLOYEE_ID) ?? employees[0];
}

export function getCurrentManager() {
  return currentManager;
}

export function getEmployees() {
  return employees;
}

export function getEmployeeWeek() {
  return employeeWeek;
}

export function getTimeOffRequests() {
  return timeOffRequests;
}

export function getTimeOffBalances() {
  return timeOffBalances;
}

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

export function formatPeriod(weekStart: string, weekEnd: string) {
  const start = parseIsoDate(weekStart);
  const end = parseIsoDate(weekEnd);
  const startLabel = start.getFullYear() === end.getFullYear() ? monthDay.format(start) : monthDayYear.format(start);

  return `${startLabel} - ${monthDayYear.format(end)}`;
}

export function getTimesheetRows(): TimesheetRow[] {
  return timesheets.map((timesheet) => {
    const employee = getEmployeeById(timesheet.employeeId);

    return {
      ...timesheet,
      employee,
      employeeName: employee?.name ?? 'Unknown Employee',
      initials: employee?.initials ?? '??',
      period: formatPeriod(timesheet.weekStart, timesheet.weekEnd),
      totalHours: formatMinutes(timesheet.totalMinutes),
    };
  });
}

export function getApprovalRows(): ApprovalRow[] {
  return approvals.map((approval) => {
    const employee = getEmployeeById(approval.employeeId);

    return {
      ...approval,
      employee,
      employeeName: employee?.name ?? 'Unknown Employee',
      initials: employee?.initials ?? '??',
      role: employee?.title ?? 'Team member',
    };
  });
}

export function getActivityFeed(): ActivityFeedItem[] {
  return recentActivity.map((activity) => {
    const employee = getEmployeeById(activity.employeeId);
    const prefix = employee?.id === CURRENT_EMPLOYEE_ID ? 'You' : (employee?.name ?? 'Unknown Employee');

    return {
      ...activity,
      message: `${prefix} ${activity.summary}`,
    };
  });
}

export function getTimeOffRequestsForEmployee(employeeId = CURRENT_EMPLOYEE_ID) {
  return timeOffRequests.filter((request) => request.employeeId === employeeId);
}
