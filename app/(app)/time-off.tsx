import { Text, View } from 'react-native';

import { timeOffRequests } from '@/components/app/mock-data';
import { Card, DataList, PageContainer, StatusPill } from '@/components/app/ui';

export default function TimeOffScreen() {
  return (
    <PageContainer
      title="Time Off"
      description="A manager-friendly calendar and request overview that keeps balances, request state, and planning conflicts easy to scan."
      actions={
        <View className="rounded-2xl bg-slate-950 px-4 py-3">
          <Text className="text-sm font-medium text-slate-50">Request time off</Text>
        </View>
      }>
      <View className="gap-4 lg:flex-row">
        <View className="flex-1">
          <Card eyebrow="Balance" title="Available time">
            <View className="flex-row flex-wrap gap-4">
              <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Text className="text-sm text-slate-500">Vacation</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">6.5 days</Text>
              </View>
              <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Text className="text-sm text-slate-500">Personal</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">2 days</Text>
              </View>
              <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Text className="text-sm text-slate-500">Sick</Text>
                <Text className="mt-2 text-2xl font-semibold text-slate-950">Flexible</Text>
              </View>
            </View>
          </Card>
        </View>
        <View className="flex-1">
          <Card eyebrow="Outlook" title="Upcoming coverage">
            <View className="gap-3">
              <Text className="text-sm leading-6 text-slate-600">Two overlapping absences next week affect the Design team.</Text>
              <StatusPill label="Coverage risk: moderate" tone="warning" />
            </View>
          </Card>
        </View>
      </View>

      <Card eyebrow="Requests" title="Recent activity">
        <DataList
          columns={['Employee', 'Type', 'Dates', 'Days', 'Status']}
          rows={timeOffRequests.map((request) => [
            request.employee,
            request.type,
            request.range,
            request.days,
            request.status,
          ])}
        />
      </Card>
    </PageContainer>
  );
}
