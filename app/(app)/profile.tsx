import { Bell, BriefcaseBusiness, CalendarDays, Camera, ChevronRight, CircleHelp, Settings, UserRound } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { profileHighlights } from '@/components/app/mock-data';
import { MobileCard, MobileListRow, MobilePage, MobilePill } from '@/components/app/mobile-ui';
import { Card, PageContainer, StatusPill } from '@/components/app/ui';

export default function ProfileScreen() {
  return (
    <>
      <MobilePage title="Profile" description="View and manage your personal and work information.">
        <MobileCard>
          <View className="flex-row items-center gap-4">
            <View className="relative h-20 w-20 items-center justify-center rounded-full bg-[#1764ff]">
              <Text className="text-[28px] font-semibold text-white">TC</Text>
              <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 dark:border-slate-900">
                <Camera size={13} color="#fff" />
              </View>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-lg font-semibold text-slate-950 dark:text-slate-50">Thomas Carter</Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">Senior Field Engineer</Text>
              <View className="mt-2">
                <MobilePill label="Employee" tone="positive" />
              </View>
              <Text numberOfLines={1} className="mt-2 text-xs text-slate-500 dark:text-slate-400">thomas.carter@expertgeo.com</Text>
            </View>
          </View>
        </MobileCard>

        <MobileCard title="Employment details" action={<Text className="text-xs font-semibold text-[#1764ff]">Edit</Text>}>
          {profileHighlights.map((item) => (
            <MobileListRow
              key={item.label}
              icon={item.label === 'Manager' ? <UserRound size={16} color="#64748b" /> : item.label === 'Work schedule' ? <CalendarDays size={16} color="#64748b" /> : <BriefcaseBusiness size={16} color="#64748b" />}
              title={item.label}
              meta={
                <View className="flex-row items-center gap-2">
                  <Text numberOfLines={1} className="max-w-[150px] text-right text-xs font-medium text-slate-600 dark:text-slate-300">{item.value}</Text>
                  <ChevronRight size={15} color="#94a3b8" />
                </View>
              }
            />
          ))}
        </MobileCard>

        <MobileCard title="Settings & preferences">
          {[
            { label: 'Notifications', value: 'Email and push', icon: <Bell size={16} color="#64748b" /> },
            { label: 'Appearance', value: 'Dark mode', icon: <Settings size={16} color="#64748b" /> },
            { label: 'Help & support', value: 'Get help', icon: <CircleHelp size={16} color="#64748b" /> },
          ].map((item) => (
            <MobileListRow
              key={item.label}
              icon={item.icon}
              title={item.label}
              meta={
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.value}</Text>
                  <ChevronRight size={15} color="#94a3b8" />
                </View>
              }
            />
          ))}
        </MobileCard>
      </MobilePage>

      <View className="hidden flex-1 lg:flex">
        <PageContainer
          title="Profile"
          description="A compact employee profile focused on operational details that matter in a workforce app: reporting chain, schedule, and policy context."
          actions={
            <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-100">Edit preferences</Text>
            </View>
          }>
          <View className="gap-4 lg:flex-row">
            <View className="flex-1">
              <Card eyebrow="Employee" title="Thomas Carter">
                <Text className="text-sm text-slate-500 dark:text-slate-400">Senior Software Engineer</Text>
                <View className="mt-4">
                  <StatusPill label="Approvals current" tone="positive" />
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card eyebrow="Details" title="Employment information">
                <View className="gap-4">
                  {profileHighlights.map((item) => (
                    <View key={item.label} className="flex-row items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                      <Text className="text-sm text-slate-500 dark:text-slate-400">{item.label}</Text>
                      <Text className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.value}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          </View>
        </PageContainer>
      </View>
    </>
  );
}
