export type DepartmentHours = {
  department: string;
  hours: string;
  percent: number;
  color: string;
};

export type ReportMetric = {
  label: string;
  value: string;
  change: string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
};
