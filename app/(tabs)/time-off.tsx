import { CalendarCheck2, Clock3, Plane } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';

import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { TimeOffList } from '@/components/timeoff/TimeOffList';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { timeOffBalances, timeOffRequests } from '@/data/timeoff';

export default function TimeOffScreen() {
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width >= 1040;
  const upcoming = timeOffRequests.filter((request) => request.timeframe === 'upcoming');
  const past = timeOffRequests.filter((request) => request.timeframe === 'past');

  return (
    <ScreenContainer>
      <PageHeader
        title="Time Off"
        subtitle={Platform.OS === 'web' ? 'Track requests, balances, and upcoming absences' : undefined}
      />
      {Platform.OS !== 'web' ? (
        <HStack className="mb-5 border-b border-slate-200">
          <Box className="flex-1 border-b-2 border-emerald-700 py-3">
            <Text className="text-center font-bold text-emerald-700">My Requests</Text>
          </Box>
          <Box className="flex-1 py-3">
            <Text className="text-center font-semibold text-slate-600">Balances</Text>
          </Box>
        </HStack>
      ) : (
        <Box className="mb-4" style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
          <StatCard title="Time Off Balance" value="15 days" detail="available" tone="green" icon={CalendarCheck2} />
          <StatCard title="Pending Requests" value="9" detail="teamwide" tone="orange" icon={Clock3} />
          <StatCard title="Upcoming Vacation" value="5 days" detail="May 5 - May 9" tone="purple" icon={Plane} />
        </Box>
      )}
      <Box style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
        <TimeOffList title="Upcoming" requests={upcoming} showViewAll />
        <TimeOffList title="Past" requests={past} showViewAll />
        {Platform.OS === 'web' ? (
          <Box className="min-w-[300px] flex-1 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <Text className="text-xl font-bold text-slate-950 dark:text-white">Balances</Text>
            <VStack className="mt-5 gap-5">
              {timeOffBalances.map((balance) => {
                const percent = (balance.used / balance.total) * 100;

                return (
                  <Box key={balance.label}>
                    <HStack className="mb-2 items-center justify-between">
                      <Text className="font-semibold text-slate-950 dark:text-white">{balance.label}</Text>
                      <Text className="text-slate-600 dark:text-slate-400">{balance.available} available</Text>
                    </HStack>
                    <Progress value={percent} size="sm" className="bg-slate-200 dark:bg-slate-700">
                      <ProgressFilledTrack className="bg-emerald-700" />
                    </Progress>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        ) : null}
      </Box>
      {Platform.OS !== 'web' ? (
        <Button action="positive" className="mt-5 rounded-lg bg-emerald-700">
          <ButtonText className="font-bold text-white">+ Request Time Off</ButtonText>
        </Button>
      ) : null}
    </ScreenContainer>
  );
}
