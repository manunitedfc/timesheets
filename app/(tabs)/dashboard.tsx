import { CalendarCheck2, Clock3, FileText, Timer, UsersRound } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native'; // useWindowDimensions kept for EmployeeDashboard (native only)

import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { ApprovalList } from '@/components/dashboard/ApprovalList';
import { HoursChart } from '@/components/dashboard/HoursChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { TimeOffList } from '@/components/timeoff/TimeOffList';
import { WeeklyTimesheetCard } from '@/components/timesheets/WeeklyTimesheetCard';
import { Box } from '@/components/ui/box';
import { currentEmployee } from '@/data/employees';
import { timeOffRequests } from '@/data/timeoff';
import { recentActivity } from '@/data/timesheets';

export default function DashboardScreen() {
  return Platform.OS === 'web' ? <AdminDashboard /> : <EmployeeDashboard />;
}

function AdminDashboard() {
  return (
    <ScreenContainer>
      <PageHeader title="Dashboard" subtitle="Overview of timesheet activities" />
      <Box className="flex-col lg:flex-row flex-wrap gap-4">
        <StatCard
          title="Total Hours This Week"
          value="1,248h 30m"
          trend="+12%"
          detail="from last week"
          sparkline={[8, 11, 10, 14, 12, 16, 15, 19, 18, 22, 20, 24]}
        />
        <StatCard
          title="Overtime This Week"
          value="128h 45m"
          trend="+8%"
          detail="from last week"
          tone="orange"
          sparkline={[5, 9, 7, 11, 8, 12, 9, 14, 12, 17, 14, 18]}
        />
        <StatCard
          title="Pending Approvals"
          value="12"
          detail="3 timesheets - 9 time off"
          tone="purple"
          icon={UsersRound}
        />
        <StatCard title="Active Users" value="56" trend="+4 from last week" tone="green" icon={UsersRound} />
      </Box>

      <Box className="mt-4 flex-col lg:flex-row gap-4">
        <ApprovalList compact />
        <HoursChart />
      </Box>

      <Box className="mt-4 flex-col lg:flex-row gap-4">
        <ActivityCard activities={recentActivity} />
        <QuickActions />
      </Box>
    </ScreenContainer>
  );
}

function EmployeeDashboard() {
  const { width } = useWindowDimensions();
  const twoColumns = width > 420;
  const upcoming = timeOffRequests
    .filter((request) => request.employeeId === 'emp-001' && request.timeframe === 'upcoming')
    .slice(0, 2);

  return (
    <ScreenContainer>
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${currentEmployee.name.split(' ')[0]}!`} />
      <Box style={{ flexDirection: 'column', gap: 12 }}>
        <StatCard
          title="Total Hours This Week"
          value="38h 45m"
          detail="of 40h"
          tone="green"
          icon={Clock3}
          progress={96}
        />
        <Box style={{ flexDirection: twoColumns ? 'row' : 'column', flexWrap: 'wrap', gap: 12 }}>
          <StatCard title="Time Off Balance" value="15 days" detail="Available" tone="green" icon={CalendarCheck2} />
          <StatCard title="Overtime This Week" value="2h 30m" detail="of 5h" tone="orange" icon={Timer} progress={50} />
          <StatCard title="Pending Requests" value="1" detail="View details" tone="purple" icon={FileText} />
        </Box>
        <WeeklyTimesheetCard />
        <TimeOffList title="Upcoming Time Off" requests={upcoming} showViewAll />
        <ActivityCard activities={recentActivity.slice(0, 3)} employeeMode />
        <QuickActions />
      </Box>
    </ScreenContainer>
  );
}
