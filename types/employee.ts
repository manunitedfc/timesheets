export type Department =
  | 'Development'
  | 'Operations'
  | 'QA / Testing'
  | 'Design'
  | 'Management'
  | 'Geophysics';

export type EmployeeStatus = 'active' | 'away' | 'inactive';

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: Department;
  email: string;
  location: string;
  weeklyHours: string;
  initials: string;
  status: EmployeeStatus;
};
