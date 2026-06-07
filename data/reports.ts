import type { DepartmentHours, ReportMetric } from '@/types';

export const departmentHours: DepartmentHours[] = [
  { department: 'Development', hours: '520h 30m', percent: 41, color: '#2563eb' },
  { department: 'Operations', hours: '320h 15m', percent: 26, color: '#7ab3ff' },
  { department: 'QA / Testing', hours: '180h 45m', percent: 14, color: '#fb923c' },
  { department: 'Design', hours: '140h 30m', percent: 11, color: '#f59e0b' },
  { department: 'Other', hours: '86h 30m', percent: 7, color: '#8b5cf6' },
];

export const reportMetrics: ReportMetric[] = [
  { label: 'Total Hours', value: '5,680h 45m', change: '+12% from last month', tone: 'blue' },
  { label: 'Overtime', value: '450h 30m', change: '+8% from last month', tone: 'orange' },
  { label: 'Time Off Used', value: '32 days', change: '-4% from last month', tone: 'green' },
  { label: 'Utilization', value: '91%', change: '+3% from last month', tone: 'purple' },
];

export const monthlyHoursBars = [
  12, 3, 8, 18, 6, 10, 5, 28, 9, 15, 4, 22, 8, 12, 31, 7, 11, 19, 26, 5, 14, 21,
  9, 24, 6, 18, 29, 8, 16, 22,
];

export const overtimeBars = [
  3, 18, 7, 4, 13, 5, 21, 9, 17, 6, 24, 8, 12, 5, 20, 9, 14, 7, 25, 10, 21, 6, 13,
  19, 8, 22, 27, 9, 15, 23,
];

export const timeOffBars = [
  5, 16, 8, 25, 11, 7, 20, 14, 10, 9, 12, 6, 8, 5, 4, 6, 7, 8, 18, 12, 5, 9, 16,
  7, 11, 14, 6, 10, 12, 19,
];
