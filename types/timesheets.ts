export type TimesheetDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayStatus = 'completed' | 'draft' | 'not-started';

export type TimesheetDayField = 'hours' | 'overtime' | 'vacation' | 'sick' | 'field' | 'job' | 'description';

export type TimesheetWeekStatus = 'draft' | 'submitted';

export type DayStatusMeta = {
  label: string;
  dot: string;
  textColor: string;
  pillBg: string;
  pillText: string;
};

export type TimesheetDayEntry = {
  hours: string;
  overtime: string;
  vacation: string;
  sick: string;
  field: string;
  job: string;
  description: string;
};

export type TimesheetDay = {
  key: TimesheetDayKey;
  short: string;
  full: string;
  mobile: {
    date: string;
    numericDate: string;
  };
  desktop: {
    date: string;
  };
  entry: TimesheetDayEntry;
  totals: {
    mobile: string;
    desktop: string;
  };
};

export type TimesheetTotals = {
  hours: string;
  overtime: string;
  vacation: string;
  sick: string;
  field: string;
  mobileTotal: string;
};

export type TimesheetWeek = {
  weekOffset: number;
  weekNumber: number;
  range: string;
  status: TimesheetWeekStatus;
  days: TimesheetDay[];
  totals: TimesheetTotals;
};

export type WeekPickerOption = {
  offset: number;
  label: string;
  range: string;
};
