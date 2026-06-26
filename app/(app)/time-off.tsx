import { Heart, Plane, Plus, UserRound } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { timeOffRequests } from '@/components/app/mock-data';
import { MobileCard, MobileListRow, MobilePage, MobilePill } from '@/components/app/mobile-ui';
import { Card, DataList, PageContainer, StatusPill } from '@/components/app/ui';

export default function TimeOffScreen() {
  return (
    <>
      <MobilePage title="Time Off" description="Request time away and track your balance.">
        <View className="self-end rounded-2xl bg-[#1764ff] px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold text-white">Request time off</Text>
            <Plus size={17} color="#fff" />
          </View>
        </View>

        <MobileCard title="Available balance">
          <View className="flex-row gap-2">
            {[
              { label: 'Vacation', value: '6.5 days', sub: '80 hours', icon: <Plane size={18} color="#1764ff" /> },
              { label: 'Personal', value: '2 days', sub: '16 hours', icon: <UserRound size={18} color="#64748b" /> },
              { label: 'Sick', value: 'Flexible', sub: 'No limit', icon: <Heart size={18} color="#94a3b8" /> },
            ].map((item) => (
              <View key={item.label} className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <View className="flex-row items-start justify-between gap-2">
                  <Text numberOfLines={1} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</Text>
                  {item.icon}
                </View>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">
                  {item.value}
                </Text>
                <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.sub}</Text>
              </View>
            ))}
          </View>
        </MobileCard>

        <MobileCard title="Upcoming time off" action={<Text className="text-xs font-semibold text-[#1764ff]">View all</Text>}>
          <MobileListRow
            icon={<Plane size={17} color="#1764ff" />}
            title="Vacation"
            subtitle="Jul 6 - Jul 10, 2026"
            meta={<MobilePill label="Approved" tone="positive" />}
          />
        </MobileCard>

        <MobileCard title="Recent requests">
          {timeOffRequests.map((request) => (
            <MobileListRow
              key={`${request.type}-${request.range}`}
              icon={<Plane size={17} color="#1764ff" />}
              title={request.type}
              subtitle={request.range}
              meta={<MobilePill label={request.status} tone={request.status === 'Approved' ? 'positive' : 'warning'} />}
            />
          ))}
        </MobileCard>
      </MobilePage>

      <View className="hidden flex-1 lg:flex">
        <PageContainer
          title="Time Off"
          description="A manager-friendly calendar and request overview that keeps balances, request state, and planning conflicts easy to scan."
          actions={
            <View className="rounded-2xl bg-slate-950 px-4 py-3 dark:bg-white">
              <Text className="text-sm font-medium text-slate-50 dark:text-slate-950">Request time off</Text>
            </View>
          }>
          <View className="gap-4 lg:flex-row">
            <View className="flex-1">
              <Card eyebrow="Balance" title="Available time">
                <View className="flex-row flex-wrap gap-4">
                  <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">Vacation</Text>
                    <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">6.5 days</Text>
                  </View>
                  <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">Personal</Text>
                    <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">2 days</Text>
                  </View>
                  <View className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">Sick</Text>
                    <Text className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">Flexible</Text>
                  </View>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card eyebrow="Outlook" title="Upcoming coverage">
                <View className="gap-3">
                  <Text className="text-sm leading-6 text-slate-600 dark:text-slate-300">Two overlapping absences next week affect the Design team.</Text>
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
      </View>
    </>
  );
}
