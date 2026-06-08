import { CheckCircle2, Plus } from 'lucide-react-native';
import { Platform } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { getEmployeeWeek } from '@/data/mockSelectors';

type WeeklyTimesheetCardProps = {
  detailed?: boolean;
};

export function WeeklyTimesheetCard({ detailed = false }: WeeklyTimesheetCardProps) {
  const mobileList = Platform.OS !== 'web' && detailed;
  const employeeWeek = getEmployeeWeek();

  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <HStack className="mb-3 items-center justify-between">
        <Box>
          <Text className={`text-base font-bold ${t.text.primary}`}>My Timesheet This Week</Text>
          <Text className={`mt-1 text-sm ${t.text.muted}`}>Apr 21 - Apr 27, 2025</Text>
        </Box>
      </HStack>

      {mobileList ? (
        <VStack className="gap-3">
          {employeeWeek.map((day) => (
            <HStack
              key={day.date}
              className={`items-center gap-4 rounded-lg border px-4 py-3 ${t.border.default} ${
                day.date === 'Apr 23' ? 'bg-emerald-50 dark:bg-emerald-950' : t.bg.surface
              }`}
            >
              <Box className="min-w-0 flex-1">
                <Text className={`font-semibold ${t.text.primary}`}>
                  {day.day}, {day.date}
                </Text>
                {day.project ? <Text className={`mt-1 text-sm ${t.text.muted}`}>{day.project}</Text> : null}
              </Box>
              <HStack className="items-center gap-2">
                <Text className={`font-bold ${t.text.primary}`}>{day.hours}</Text>
                {day.approved ? <CheckCircle2 size={16} color="#0f8a3b" /> : null}
              </HStack>
            </HStack>
          ))}
        </VStack>
      ) : (
        <Box>
          <HStack className="items-center justify-between">
            {employeeWeek.map((day) => {
              const selected = day.date === 'Apr 23';

              return (
                <VStack key={day.date} className="items-center gap-3">
                  <Text className={`font-semibold ${selected ? 'text-emerald-700' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day.day}
                  </Text>
                  <Box
                    className={`h-11 w-11 items-center justify-center rounded-full ${
                      selected ? 'bg-emerald-700' : 'bg-transparent'
                    }`}
                  >
                    <Text className={`font-bold ${selected ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                      {day.date.replace('Apr ', '')}
                    </Text>
                  </Box>
                  <Text className={`font-bold ${selected ? 'text-emerald-700' : 'text-slate-950 dark:text-white'}`}>
                    {day.hours}
                  </Text>
                </VStack>
              );
            })}
          </HStack>
        </Box>
      )}

      <VStack className="mt-6 gap-4">
        <HStack className="items-center gap-4">
          <Box className="min-w-0 flex-1">
            <Progress value={96} size="sm" className="bg-slate-200 dark:bg-slate-700">
              <ProgressFilledTrack className="bg-emerald-700" />
            </Progress>
          </Box>
          <Text className={`font-semibold ${t.text.primary}`}>Total: 38h 45m of 40h</Text>
        </HStack>
        <Button
          action="positive"
          className="self-start rounded-lg bg-emerald-50 px-5 data-[hover=true]:bg-emerald-100"
        >
          {detailed ? <ButtonIcon as={Plus} /> : null}
          <ButtonText className="font-bold text-emerald-800">
            {detailed ? 'Add Entry' : 'View Timesheet'}
          </ButtonText>
        </Button>
      </VStack>
    </Card>
  );
}
