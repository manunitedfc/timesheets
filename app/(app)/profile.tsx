import { Text, View } from 'react-native';

import { profileHighlights } from '@/components/app/mock-data';
import { Card, PageContainer, StatusPill } from '@/components/app/ui';

export default function ProfileScreen() {
  return (
    <PageContainer
      title="Profile"
      description="A compact employee profile focused on operational details that matter in a workforce app: reporting chain, schedule, and policy context."
      actions={
        <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Text className="text-sm font-medium text-slate-700">Edit preferences</Text>
        </View>
      }>
      <View className="gap-4 lg:flex-row">
        <View className="flex-1">
          <Card eyebrow="Employee" title="Thomas Carter">
            <Text className="text-sm text-slate-500">Senior Software Engineer</Text>
            <View className="mt-4">
              <StatusPill label="Approvals current" tone="positive" />
            </View>
          </Card>
        </View>
        <View className="flex-1">
          <Card eyebrow="Details" title="Employment information">
            <View className="gap-4">
              {profileHighlights.map((item) => (
                <View key={item.label} className="flex-row items-center justify-between border-b border-slate-100 pb-3">
                  <Text className="text-sm text-slate-500">{item.label}</Text>
                  <Text className="text-sm font-medium text-slate-900">{item.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </View>
    </PageContainer>
  );
}
