export type ApprovalType = 'Timesheet' | 'Time Off';

export type Approval = {
  id: string;
  employeeId: string;
  type: ApprovalType;
  period: string;
  amount: string;
  submittedAt: string;
};
