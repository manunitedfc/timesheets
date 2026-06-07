import { CheckCircle2, Clock3, FileText } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';

import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { TimesheetTable } from '@/components/timesheets/TimesheetTable';
import { WeeklyTimesheetCard } from '@/components/timesheets/WeeklyTimesheetCard';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

export default function TimesheetsScreen() {
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width >= 1040;

  return (
    <ScreenContainer>
      <PageHeader
        title="Timesheets"
        subtitle={Platform.OS === 'web' ? 'Review team submissions and weekly hours' : 'Apr 21 - Apr 27, 2025'}
      />
      {Platform.OS !== 'web' ? (
        <HStack className="mb-5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <Box className="flex-1 rounded-lg bg-white py-3 dark:bg-slate-700">
            <Text className="text-center font-bold text-emerald-700">Week</Text>
          </Box>
          <Box className="flex-1 py-3">
            <Text className="text-center font-semibold text-slate-600 dark:text-slate-400">Summary</Text>
          </Box>
        </HStack>
      ) : (
        <Box className="mb-4" style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
          <StatCard title="Pending Review" value="3" detail="timesheets" tone="orange" icon={FileText} />
          <StatCard title="Approved" value="18" detail="this week" tone="green" icon={CheckCircle2} />
          <StatCard title="Average Hours" value="39h 10m" detail="per employee" tone="blue" icon={Clock3} />
        </Box>
      )}
      <Box style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
        <WeeklyTimesheetCard detailed={Platform.OS !== 'web'} />
        {Platform.OS === 'web' ? <TimesheetTable /> : null}
      </Box>
    </ScreenContainer>
  );
}
