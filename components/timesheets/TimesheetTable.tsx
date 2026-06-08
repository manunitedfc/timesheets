import { FileText } from 'lucide-react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { getTimesheetRows } from '@/data/mockSelectors';

export function TimesheetTable() {
  const timesheets = getTimesheetRows();

  return (
    <Card size="md" variant="outline" className={`p-4 lg:p-3 ${t.card}`}>
      <HStack className="mb-3 items-center justify-between">
        <Text className={`text-base font-bold ${t.text.primary}`}>Team Timesheets</Text>
        <HStack className="items-center gap-2">
          <FileText size={18} color="#2563eb" />
          <Text className={`font-semibold ${t.text.brand}`}>This week</Text>
        </HStack>
      </HStack>
      <VStack className="gap-4">
        {timesheets.map((timesheet) => {
          const tone =
            timesheet.status === 'approved' ? 'green' : timesheet.status === 'rejected' ? 'red' : 'orange';

          return (
            <HStack key={timesheet.id} className={`items-center gap-3 rounded-lg border px-3 py-2 ${t.border.subtle}`}>
              <AvatarInitials initials={timesheet.initials} />
              <Box className="min-w-0 flex-1">
                <Text className={`font-bold ${t.text.primary}`}>{timesheet.employeeName}</Text>
                <Text className={`mt-1 text-sm ${t.text.muted}`}>{timesheet.period}</Text>
              </Box>
              <Text className={`font-bold ${t.text.primary}`}>{timesheet.totalHours}</Text>
              <StatusBadge label={timesheet.status} tone={tone} />
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
