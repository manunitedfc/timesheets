import Svg, { Circle, G } from 'react-native-svg';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { departmentHours } from '@/data/reports';

export function HoursChart() {
  const size = 220;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <Text className={`mb-3 text-base font-bold ${t.text.primary}`}>Hours by Department (This Week)</Text>
      <HStack className="flex-wrap items-center justify-center gap-8">
        <Box className="h-[240px] w-[240px] items-center justify-center">
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {departmentHours.map((item) => {
                const dash = (item.percent / 100) * circumference;
                const segment = (
                  <Circle
                    key={item.department}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                    fill="none"
                  />
                );
                offset += dash;
                return segment;
              })}
            </G>
          </Svg>
          <Box className="absolute items-center">
            <Text className={`text-xl font-bold ${t.text.primary}`}>1,248h 30m</Text>
            <Text className={`mt-1 ${t.text.muted}`}>Total Hours</Text>
          </Box>
        </Box>
        <VStack className="min-w-[260px] flex-1 gap-4">
          {departmentHours.map((item) => (
            <HStack key={item.department} className="items-center gap-3">
              <Box className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <Text className={`min-w-0 flex-1 font-semibold ${t.text.primary}`}>{item.department}</Text>
              <Text className={t.text.secondary}>
                {item.hours} ({item.percent}%)
              </Text>
            </HStack>
          ))}
        </VStack>
      </HStack>
    </Card>
  );
}
