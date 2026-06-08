import type { Approval } from '@/types';

export const approvals: Approval[] = [
  {
    id: 'apr-001',
    employeeId: 'emp-001',
    type: 'Timesheet',
    period: 'Apr 21 - Apr 27, 2025',
    amount: '8h 00m',
    submittedAt: '2 minutes ago',
  },
  {
    id: 'apr-002',
    employeeId: 'emp-002',
    type: 'Time Off',
    period: 'May 5 - May 9, 2025',
    amount: '5 days',
    submittedAt: '15 minutes ago',
  },
  {
    id: 'apr-003',
    employeeId: 'emp-003',
    type: 'Timesheet',
    period: 'Apr 21 - Apr 27, 2025',
    amount: '7h 30m',
    submittedAt: '1 hour ago',
  },
  {
    id: 'apr-004',
    employeeId: 'emp-004',
    type: 'Time Off',
    period: 'Apr 28 - Apr 30, 2025',
    amount: '3 days',
    submittedAt: '2 hours ago',
  },
];
