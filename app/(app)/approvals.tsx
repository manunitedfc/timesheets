import { Text, View } from 'react-native';

import { approvalQueue } from '@/components/app/mock-data';
import { Card, DataList, PageContainer } from '@/components/app/ui';

export default function ApprovalsScreen() {
  return (
    <PageContainer
      title="Approvals"
      description="A centralized review queue designed for desktop workflows where managers triage timesheets, leave requests, and exceptions quickly."
      actions={
        <View className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-100">Filter by manager</Text>
        </View>
      }>
      <Card eyebrow="Queue" title="Items awaiting review">
        <DataList
          columns={['Employee', 'Item', 'Submitted', 'Status']}
          rows={approvalQueue.map((item) => [item.employee, item.item, item.submitted, item.status])}
        />
      </Card>
    </PageContainer>
  );
}
