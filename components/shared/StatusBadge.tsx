import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { t } from '@/constants/tokens';

type StatusBadgeProps = {
  label: string;
  tone?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'slate';
};

export function StatusBadge({ label, tone = 'slate' }: StatusBadgeProps) {
  const { bg, text } = t.status[tone];

  return (
    <Box className={`rounded-md px-3 py-1 ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </Box>
  );
}
