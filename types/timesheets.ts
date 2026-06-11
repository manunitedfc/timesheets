export type TimesheetDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayStatus = 'completed' | 'draft' | 'not-started';

export type DayStatusMeta = {
  label: string;
  dot: string;
  textColor: string;
  pillBg: string;
  pillText: string;
};

export type TimesheetDay = {
  key: TimesheetDayKey;
  short: string;
  date: string;
  numericDate: string;
  total: string;
  hours: string;
  overtime: string;
  vacation: string;
  sick: string;
  field: string;
  job: string;
  description: string;
};

export type WeekPickerOption = {
  offset: number;
  label: string;
  range: string;
};
