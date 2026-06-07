export type TimesheetDay = {
  day: string;
  date: string;
  hours: string;
  project?: string;
  approved?: boolean;
};

export type TimesheetStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type Timesheet = {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  totalHours: string;
  status: TimesheetStatus;
};

export type ActivityEvent = {
  id: string;
  message: string;
  time: string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
};
