import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Platform } from 'react-native';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { TimesheetStatus } from '@/types';

type WeekNavProps = {
  weekLabel: string;
  weekNum: number;
  status: TimesheetStatus;
  lastSavedAt: Date | null;
  isReadOnly: boolean;
  compact?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onCopyLastWeek: () => void;
  onClearWeek: () => void;
  onSubmit: () => void;
};

const STATUS_COLORS: Record<TimesheetStatus, string> = {
  draft: 'text-amber-600 dark:text-amber-400',
  submitted: 'text-blue-600 dark:text-blue-400',
  approved: 'text-emerald-600 dark:text-emerald-400',
  rejected: 'text-red-600 dark:text-red-400',
};

const STATUS_BG: Record<TimesheetStatus, string> = {
  draft: 'bg-amber-50 dark:bg-amber-950',
  submitted: 'bg-blue-50 dark:bg-blue-950',
  approved: 'bg-emerald-50 dark:bg-emerald-950',
  rejected: 'bg-red-50 dark:bg-red-950',
};

export function WeekNav({ weekLabel, status, onPrev, onNext, compact }: WeekNavProps) {
  const isMobile = compact ?? Platform.OS !== 'web';
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  if (isMobile) {
    return (
      <VStack className={`gap-4 px-4 pb-4 pt-2 ${t.bg.page}`}>
        <HStack className="items-center justify-between gap-3">
          <Pressable
            onPress={onPrev}
            className={`items-center justify-center rounded-lg border active:opacity-60 ${t.border.default} ${t.bg.surface}`}
            style={{ height: 56, width: 56 }}
          >
            <ChevronLeft size={24} color={isDark ? '#f1f5f9' : '#0f172a'} />
          </Pressable>

          <VStack className="min-w-0 flex-1 items-center gap-2 px-2 py-1">
            <Text className={`text-xl font-bold ${t.text.primary}`} style={{ textAlign: 'center' }}>
              {weekLabel}
            </Text>
            <Box className={`rounded-full px-3 py-1 ${STATUS_BG[status]}`}>
              <Text className={`text-sm font-semibold ${STATUS_COLORS[status]}`}>{statusLabel}</Text>
            </Box>
          </VStack>

          <Pressable
            onPress={onNext}
            className={`items-center justify-center rounded-lg border active:opacity-60 ${t.border.default} ${t.bg.surface}`}
            style={{ height: 56, width: 56 }}
          >
            <ChevronRight size={24} color={isDark ? '#f1f5f9' : '#0f172a'} />
          </Pressable>
        </HStack>
      </VStack>
    );
  }

  return (
    <HStack className={`items-center gap-3 border-b px-6 py-4 ${t.border.default} ${t.bg.surface}`}>
      <Pressable
        onPress={onPrev}
        className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 active:opacity-60 ${t.border.default} ${t.bg.elevated}`}
      >
        <ChevronLeft size={16} color="#64748b" />
        <Text className={`text-sm font-medium ${t.text.secondary}`}>Previous Week</Text>
      </Pressable>

      <HStack className="flex-1 items-center justify-center gap-3">
        <Text className={`text-2xl font-bold ${t.text.primary}`}>{weekLabel}</Text>
        <Box className={`rounded-full px-3 py-1 ${STATUS_BG[status]}`}>
          <Text className={`text-sm font-semibold ${STATUS_COLORS[status]}`}>{statusLabel}</Text>
        </Box>
      </HStack>

      <Pressable
        onPress={onNext}
        className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 active:opacity-60 ${t.border.default} ${t.bg.elevated}`}
      >
        <Text className={`text-sm font-medium ${t.text.secondary}`}>Next Week</Text>
        <ChevronRight size={16} color="#64748b" />
      </Pressable>
    </HStack>
  );
}
