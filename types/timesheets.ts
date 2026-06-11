export type TimesheetDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayStatus = 'completed' | 'draft' | 'not-started';

export type TimesheetDayField = 'hours' | 'overtime' | 'vacation' | 'sick' | 'field' | 'job' | 'description';

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
  full: string;
  mobile: {
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
  desktop: {
    date: string;
    total: string;
    hours: string;
    overtime: string;
    vacation: string;
    sick: string;
    field: string;
    job: string;
    description: string;
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
  days: TimesheetDay[];
  totals: TimesheetTotals;
};

export type WeekPickerOption = {
  offset: number;
  label: string;
  range: string;
};
