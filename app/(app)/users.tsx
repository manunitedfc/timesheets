import { Text, View } from 'react-native';

import { users } from '@/components/app/mock-data';
import { Card, DataList, PageContainer } from '@/components/app/ui';

export default function UsersScreen() {
  return (
    <PageContainer
      title="Users"
      description="User administration belongs in the larger desktop workspace, where access, department data, and office assignment can be audited clearly."
      actions={
        <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Text className="text-sm font-medium text-slate-700">Invite user</Text>
        </View>
      }>
      <Card eyebrow="Directory" title="People and access">
        <DataList
          columns={['Name', 'Department', 'Office', 'Access']}
          rows={users.map((user) => [user.name, user.department, user.office, user.access])}
        />
      </Card>
    </PageContainer>
  );
}
