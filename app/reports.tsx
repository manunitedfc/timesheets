import { useWindowDimensions } from 'react-native';

import { HoursChart } from '@/components/dashboard/HoursChart';
import { ReportBarCard } from '@/components/reports/ReportBarCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Box } from '@/components/ui/box';
import { monthlyHoursBars, overtimeBars, timeOffBars } from '@/data/reports';

export default function ReportsScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 1040;

  return (
    <ScreenContainer>
      <PageHeader title="Reports" subtitle="Monthly workforce hours, overtime, and absence trends" />
      <Box style={{ flexDirection: wide ? 'row' : 'column', flexWrap: 'wrap', gap: 16 }}>
        <ReportBarCard label="Total Hours" value="5,680h 45m" bars={monthlyHoursBars} color="#2563eb" />
        <ReportBarCard label="Overtime" value="450h 30m" bars={overtimeBars} color="#f97316" />
        <ReportBarCard label="Time Off Used" value="32 days" bars={timeOffBars} color="#16a34a" />
      </Box>
      <Box className="mt-4">
        <HoursChart />
      </Box>
    </ScreenContainer>
  );
}
