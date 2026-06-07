import type { ComponentType } from 'react';
import { Platform } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

type StatCardProps = {
  title: string;
  value: string;
  detail?: string;
  trend?: string;
  tone?: 'blue' | 'green' | 'orange' | 'purple';
  icon?: ComponentType<IconProps>;
  progress?: number;
  sparkline?: number[];
};

const toneStyles = {
  blue: {
    color: '#2563eb',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    trend: 'text-blue-700 dark:text-blue-400',
    track: 'bg-blue-600',
  },
  green: {
    color: '#0f8a3b',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    trend: 'text-emerald-700 dark:text-emerald-400',
    track: 'bg-emerald-700',
  },
  orange: {
    color: '#f97316',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    trend: 'text-orange-700 dark:text-orange-400',
    track: 'bg-orange-500',
  },
  purple: {
    color: '#7c3aed',
    bg: 'bg-violet-100 dark:bg-violet-900/40',
    trend: 'text-violet-700 dark:text-violet-400',
    track: 'bg-violet-600',
  },
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 128;
  const height = 52;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={3} />
    </Svg>
  );
}

export function StatCard({
  title,
  value,
  detail,
  trend,
  tone = 'blue',
  icon: Icon,
  progress,
  sparkline,
}: StatCardProps) {
  const styles = toneStyles[tone];
  const isWeb = Platform.OS === 'web';

  return (
    <Card
      size="md"
      variant="outline"
      className={`min-w-[180px] flex-1 p-4 lg:p-3 ${t.card}`}
    >
      <HStack className="items-start justify-between gap-4">
        <VStack className="min-w-0 flex-1 gap-2">
          <Text className={`font-semibold ${t.text.secondary}`}>{title}</Text>
          <Text className={`text-2xl font-bold ${t.text.primary}`}>{value}</Text>
          {progress !== undefined ? (
            <Progress value={progress} size="sm" className={t.bg.overlay}>
              <ProgressFilledTrack className={styles.track} />
            </Progress>
          ) : null}
          {trend ? (
            <Text className={`font-semibold ${styles.trend}`}>
              {trend.startsWith('-') ? '▼ ' : '▲ '}{trend}
            </Text>
          ) : null}
          {detail ? <Text className={`text-sm ${t.text.muted}`}>{detail}</Text> : null}
        </VStack>
        {Icon ? (
          <Box className={`h-11 w-11 items-center justify-center rounded-lg ${styles.bg}`}>
            <Icon size={22} color={styles.color} />
          </Box>
        ) : sparkline && isWeb ? (
          <Box className="mt-8">
            <Sparkline data={sparkline} color={styles.color} />
          </Box>
        ) : null}
      </HStack>
    </Card>
  );
}
