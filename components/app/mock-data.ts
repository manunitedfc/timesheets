export type NavItem = {
  label: string;
  href:
    | '/dashboard'
    | '/timesheets'
    | '/time-off'
    | '/approvals'
    | '/reports'
    | '/users'
    | '/profile';
  icon:
    | 'layout-dashboard'
    | 'clock-3'
    | 'calendar-minus-2'
    | 'badge-check'
    | 'bar-chart-3'
    | 'users'
    | 'user-round';
};

export const mobileNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Timesheets', href: '/timesheets', icon: 'clock-3' },
  { label: 'Time Off', href: '/time-off', icon: 'calendar-minus-2' },
  { label: 'Profile', href: '/profile', icon: 'user-round' },
];

export const desktopNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Timesheets', href: '/timesheets', icon: 'clock-3' },
  { label: 'Time Off', href: '/time-off', icon: 'calendar-minus-2' },
  { label: 'Approvals', href: '/approvals', icon: 'badge-check' },
  { label: 'Reports', href: '/reports', icon: 'bar-chart-3' },
  { label: 'Users', href: '/users', icon: 'users' },
  { label: 'Profile', href: '/profile', icon: 'user-round' },
];

export const dashboardStats = [
  { label: 'Hours this week', value: '31.5', delta: '+4.2%', tone: 'positive' as const },
  { label: 'Pending approvals', value: '08', delta: '+2 today', tone: 'warning' as const },
  { label: 'Team utilization', value: '86%', delta: '+1.8%', tone: 'positive' as const },
  { label: 'Time off balance', value: '6.5 days', delta: '2 requests open', tone: 'neutral' as const },
];

export const dashboardActivity = [
  { title: 'Payroll lock', subtitle: 'Friday, 5:00 PM', status: 'Needs attention' },
  { title: 'Approvals review', subtitle: '14 submissions waiting', status: 'In progress' },
  { title: 'Capacity report', subtitle: 'Next refresh in 2 hours', status: 'Scheduled' },
];

export const teamMembers = [
  { name: 'Avery Morgan', role: 'Engineering Manager', location: 'Toronto', hours: '39.0h', status: 'Approved' },
  { name: 'Sofia Patel', role: 'Senior Designer', location: 'Vancouver', hours: '35.5h', status: 'Pending' },
  { name: 'Liam Chen', role: 'QA Lead', location: 'Calgary', hours: '37.0h', status: 'Approved' },
  { name: 'Maya Johnson', role: 'Product Analyst', location: 'Ottawa', hours: '32.0h', status: 'Draft' },
];

export const timesheetRows = [
  { project: 'Platform migration', client: 'Northwind', monday: 8, tuesday: 7.5, wednesday: 8, thursday: 8, friday: 6, total: 37.5, status: 'Submitted' },
  { project: 'Design system', client: 'Internal', monday: 1, tuesday: 0.5, wednesday: 0, thursday: 0, friday: 1, total: 2.5, status: 'Draft' },
];

export const timesheetWeek = {
  label: 'Current Week',
  range: 'May 31 - Jun 6, 2026',
  desktopRange: 'May 18 - May 24, 2025',
  weekNumber: 'Week 21',
  status: 'Draft',
  lastSaved: 'Last saved 2m ago',
  autosave: 'Auto-saved',
};

export const mobileTimesheetDays = [
  {
    key: 'mon', short: 'Mon', date: 'Jun 8',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'tue', short: 'Tue', date: 'Jun 9',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'wed', short: 'Wed', date: 'Jun 10',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'thu', short: 'Thu', date: 'Jun 11',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'fri', short: 'Fri', date: 'Jun 12',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'sat', short: 'Sat', date: 'Jun 13',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
  {
    key: 'sun', short: 'Sun', date: 'Jun 14',
    total: '0h 00m', hours: '', overtime: '',
    vacation: '', sick: '', field: '', job: '',
    description: '',
  },
];

export const desktopTimesheetGrid = [
  {
    day: 'Mon',
    date: 'May 18',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Tue',
    date: 'May 19',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Wed',
    date: 'May 20',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Thu',
    date: 'May 21',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Fri',
    date: 'May 22',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Sat',
    date: 'May 23',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
  {
    day: 'Sun',
    date: 'May 24',
    hours: '',
    overtime: '',
    vacation: '',
    sick: '',
    field: '',
    job: '',
    details: '',
  },
];

export const timesheetTotals = {
  hours: '40.00',
  overtime: '1.50',
  vacation: '0.00',
  sick: '0.00',
  field: '40.00',
  mobileTotal: '36h 00m',
};

export const timeOffRequests = [
  { employee: 'Sofia Patel', type: 'Vacation', range: 'Jun 17 - Jun 21', days: '5', status: 'Pending' },
  { employee: 'Maya Johnson', type: 'Personal', range: 'Jun 26', days: '1', status: 'Approved' },
  { employee: 'Liam Chen', type: 'Sick', range: 'Jul 03', days: '1', status: 'Approved' },
];

export const approvalQueue = [
  { employee: 'Avery Morgan', item: 'Weekly timesheet', submitted: '2 hours ago', status: 'Ready' },
  { employee: 'Sofia Patel', item: 'Vacation request', submitted: 'Yesterday', status: 'Review' },
  { employee: 'Maya Johnson', item: 'Expense correction', submitted: 'Yesterday', status: 'Needs follow-up' },
];

export const reports = [
  { name: 'Utilization summary', owner: 'Operations', cadence: 'Weekly', lastRun: 'Today' },
  { name: 'Project burn report', owner: 'PMO', cadence: 'Daily', lastRun: '1 hour ago' },
  { name: 'Absence trend', owner: 'HR', cadence: 'Monthly', lastRun: 'Jun 1' },
];

export const users = [
  { name: 'Avery Morgan', department: 'Engineering', office: 'Toronto', access: 'Admin' },
  { name: 'Sofia Patel', department: 'Design', office: 'Vancouver', access: 'Manager' },
  { name: 'Liam Chen', department: 'Quality', office: 'Calgary', access: 'Member' },
  { name: 'Maya Johnson', department: 'Product', office: 'Ottawa', access: 'Member' },
];

export const profileHighlights = [
  { label: 'Manager', value: 'Caroline Brooks' },
  { label: 'Employment type', value: 'Full-time' },
  { label: 'Cost center', value: 'ENG-204' },
  { label: 'Work schedule', value: 'Mon-Fri, 9:00-5:00' },
];
