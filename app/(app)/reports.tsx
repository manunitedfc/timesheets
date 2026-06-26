import { Text, View } from 'react-native';

import { reports } from '@/components/app/mock-data';
import { Card, DataList, PageContainer } from '@/components/app/ui';

export default function ReportsScreen() {
  return (
    <PageContainer
      title="Reports"
      description="Reporting is positioned as a desktop-oriented workspace with scheduled outputs, ownership visibility, and operational cadence."
      actions={
        <View className="rounded-2xl bg-slate-950 px-4 py-3 dark:bg-white">
          <Text className="text-sm font-medium text-slate-50 dark:text-slate-950">Run report</Text>
        </View>
      }>
      <Card eyebrow="Library" title="Saved reports">
        <DataList
          columns={['Report', 'Owner', 'Cadence', 'Last run']}
          rows={reports.map((report) => [report.name, report.owner, report.cadence, report.lastRun])}
        />
      </Card>
    </PageContainer>
  );
}
