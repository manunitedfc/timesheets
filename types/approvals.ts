export type ApprovalType = 'Timesheet' | 'Time Off';

export type Approval = {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  type: ApprovalType;
  period: string;
  amount: string;
  submittedAt: string;
};
