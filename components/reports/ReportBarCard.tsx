import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { t } from '@/constants/tokens';

type ReportBarCardProps = {
  label: string;
  value: string;
  bars: number[];
  color: string;
};

export function ReportBarCard({ label, value, bars, color }: ReportBarCardProps) {
  const max = Math.max(...bars);

  return (
    <Card size="md" variant="outline" className={`min-w-[280px] flex-1 p-4 lg:p-3 ${t.card}`}>
      <Text className={t.text.muted}>{label}</Text>
      <Text className={`mt-2 text-2xl font-bold ${t.text.primary}`}>{value}</Text>
      <Box className="mt-6 h-28 flex-row items-end gap-1">
        {bars.map((bar, index) => (
          <Box
            key={`${label}-${index}`}
            className="flex-1 rounded-t-sm"
            style={{
              backgroundColor: color,
              height: `${Math.max((bar / max) * 100, 8)}%`,
            }}
          />
        ))}
      </Box>
    </Card>
  );
}
