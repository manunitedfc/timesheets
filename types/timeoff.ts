export type TimeOffStatus = 'pending' | 'approved' | 'rejected';

export type TimeOffType = 'Vacation' | 'Sick Leave' | 'Personal Day' | 'Training';

export type TimeOffRequest = {
  id: string;
  employeeId: string;
  type: TimeOffType;
  dateRange: string;
  duration: string;
  status: TimeOffStatus;
  timeframe: 'upcoming' | 'past';
};

export type TimeOffBalance = {
  label: string;
  used: number;
  available: number;
  total: number;
};
