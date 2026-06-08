import { Text, View } from 'react-native';

import { dashboardActivity, dashboardStats, teamMembers } from '@/components/app/mock-data';
import { Card, DataList, PageContainer, StatCard, StatusPill } from '@/components/app/ui';

export default function DashboardScreen() {
  return (
    <PageContainer
      title="Dashboard"
      description="A unified view of weekly hours, approval pressure, and staffing signals so managers can act quickly without jumping between tools."
      actions={
        <View className="rounded-2xl bg-slate-950 px-4 py-3">
          <Text className="text-sm font-medium text-slate-50">Export snapshot</Text>
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
                <View key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Text className="text-base font-semibold text-slate-950">{item.title}</Text>
                  <Text className="mt-1 text-sm text-slate-500">{item.subtitle}</Text>
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
  );
}
