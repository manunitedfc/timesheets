/** Legacy — used by dashboard activity feed only */
export type TimesheetDay = {
  day: string;
  date: string;
  hours: string;
  project?: string;
  approved?: boolean;
};

export type TimesheetStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

/** One editable row in the timesheet grid (one calendar day) */
export type TimesheetEntryRow = {
  date: string;      // ISO "2025-05-19"
  day: string;       // "Mon"
  hours: number;
  otHours: number;
  vacation: number;
  sick: number;
  fieldHours: number;
  jobNumber: string;
  details: string;
};

/** Full payload sent to the backend on submit or auto-save */
export type TimesheetPayload = {
  weekStart: string;  // ISO "2025-05-19"
  weekEnd: string;    // ISO "2025-05-25"
  weekNumber: number;
  employeeId: string;
  entries: TimesheetEntryRow[];
  status: TimesheetStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
};

/** Validation error keyed by date then field */
export type TimesheetValidationErrors = Record<string, Partial<Record<keyof TimesheetEntryRow, string>>>;

/** Admin/manager list row — separate from employee entry */
export type Timesheet = {
  id: string;
  employeeId: string;
  weekStart: string;
  weekEnd: string;
  totalMinutes: number;
  status: TimesheetStatus;
};

export type ActivityEvent = {
  id: string;
  employeeId: string;
  summary: string;
  time: string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
};

export type ActivityFeedItem = ActivityEvent & {
  message: string;
};
