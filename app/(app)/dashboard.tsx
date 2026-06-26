import { Bell, CalendarDays, DollarSign } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { dashboardActivity, dashboardStats, teamMembers } from '@/components/app/mock-data';
import { MobileCard, MobileListRow, MobilePage, MobilePill } from '@/components/app/mobile-ui';
import { Card, DataList, PageContainer, StatCard, StatusPill } from '@/components/app/ui';

export default function DashboardScreen() {
  return (
    <>
      <MobilePage title="Good morning, Thomas" description="Here's what's happening today.">
        <MobileCard
          title="This week's timesheet"
          action={<MobilePill label="Week 26" />}>
          <View className="flex-row items-end justify-between">
            <Text className="text-[28px] font-semibold text-slate-950 dark:text-slate-50">
              31.5 <Text className="text-lg font-medium text-slate-500 dark:text-slate-400">/ 40 hours</Text>
            </Text>
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">78%</Text>
          </View>
          <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <View className="h-full w-[78%] rounded-full bg-[#1764ff]" />
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500 dark:text-slate-400">Jun 22 - Jun 28, 2026</Text>
            <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">3 days remaining</Text>
          </View>
          <View className="mt-4 rounded-2xl bg-[#1764ff] px-4 py-3">
            <Text className="text-center text-sm font-semibold text-white">Continue timesheet</Text>
          </View>
        </MobileCard>

        <MobileCard>
          <MobileListRow
            icon={<DollarSign size={17} color="#1764ff" />}
            title="Payroll deadline"
            subtitle="Friday, June 27 at 5:00 PM"
            meta={<MobilePill label="5 days left" tone="warning" />}
          />
          <MobileListRow
            icon={<CalendarDays size={17} color="#f59e0b" />}
            title="Upcoming time off"
            subtitle="Vacation, Jul 6 - Jul 10, 2026"
            meta={<MobilePill label="Approved" tone="positive" />}
          />
          <MobileListRow
            icon={<Bell size={17} color="#facc15" />}
            title="Recent activity"
            subtitle="Your time off request was approved"
            meta={<Text className="text-xs text-slate-500 dark:text-slate-400">2h ago</Text>}
          />
        </MobileCard>
      </MobilePage>

      <View className="hidden flex-1 lg:flex">
        <PageContainer
          title="Dashboard"
          description="A unified view of weekly hours, approval pressure, and staffing signals so managers can act quickly without jumping between tools."
          actions={
            <View className="rounded-2xl bg-slate-950 px-4 py-3 dark:bg-white">
              <Text className="text-sm font-medium text-slate-50 dark:text-slate-950">Export snapshot</Text>
            </View>
          }>
          <View className="flex-row flex-wrap gap-4">
            {dashboardStats.map((stat) => (
              <View key={stat.label} className="min-w-[220px] flex-1">
                <StatCard {...stat} />
              </View>
            ))}
          </View>

          <View className="gap-4 lg:flex-row">
            <View className="flex-1">
              <Card eyebrow="Today" title="Operational priorities">
                <View className="gap-4">
                  {dashboardActivity.map((item) => (
                    <View key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <Text className="text-base font-semibold text-slate-950 dark:text-slate-50">{item.title}</Text>
                      <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.subtitle}</Text>
                      <View className="mt-3">
                        <StatusPill
                          label={item.status}
                          tone={item.status === 'Needs attention' ? 'warning' : item.status === 'In progress' ? 'positive' : 'neutral'}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card eyebrow="Team" title="This week's coverage">
                <DataList
                  columns={['Name', 'Role', 'Location', 'Hours', 'Status']}
                  rows={teamMembers.map((member) => [
                    member.name,
                    member.role,
                    member.location,
                    member.hours,
                    member.status,
                  ])}
                />
              </Card>
            </View>
          </View>
        </PageContainer>
      </View>
    </>
  );
}
