import type { TimeOffBalance, TimeOffRequest } from '@/types';

export const timeOffRequests: TimeOffRequest[] = [
  {
    id: 'pto-001',
    employeeId: 'emp-001',
    type: 'Vacation',
    dateRange: 'May 5 - May 9, 2025',
    duration: '5 days',
    status: 'pending',
    timeframe: 'upcoming',
  },
  {
    id: 'pto-002',
    employeeId: 'emp-001',
    type: 'Sick Leave',
    dateRange: 'May 20, 2025',
    duration: '1 day',
    status: 'approved',
    timeframe: 'upcoming',
  },
  {
    id: 'pto-003',
    employeeId: 'emp-001',
    type: 'Personal Day',
    dateRange: 'Jun 2, 2025',
    duration: '1 day',
    status: 'pending',
    timeframe: 'upcoming',
  },
  {
    id: 'pto-004',
    employeeId: 'emp-002',
    type: 'Vacation',
    dateRange: 'May 5 - May 9, 2025',
    duration: '5 days',
    status: 'pending',
    timeframe: 'upcoming',
  },
  {
    id: 'pto-005',
    employeeId: 'emp-001',
    type: 'Vacation',
    dateRange: 'Apr 10 - Apr 12, 2025',
    duration: '3 days',
    status: 'approved',
    timeframe: 'past',
  },
];

export const timeOffBalances: TimeOffBalance[] = [
  { label: 'Vacation', used: 8, available: 15, total: 23 },
  { label: 'Sick Leave', used: 1, available: 9, total: 10 },
  { label: 'Personal', used: 2, available: 3, total: 5 },
];
