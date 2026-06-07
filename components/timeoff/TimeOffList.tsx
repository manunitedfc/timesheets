import { Heart, Plane, UserRound } from 'lucide-react-native';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import type { TimeOffRequest } from '@/types';

type TimeOffListProps = {
  title: string;
  requests: TimeOffRequest[];
  showViewAll?: boolean;
};

function getIcon(type: TimeOffRequest['type']) {
  if (type === 'Vacation') return Plane;
  if (type === 'Sick Leave') return Heart;
  return UserRound;
}

export function TimeOffList({ title, requests, showViewAll = false }: TimeOffListProps) {
  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <HStack className="mb-3 items-center justify-between">
        <Text className={`text-base font-bold ${t.text.primary}`}>{title}</Text>
        {showViewAll ? <Text className={`font-semibold ${t.text.success}`}>View all</Text> : null}
      </HStack>
      <VStack className="gap-4">
        {requests.map((request) => {
          const Icon = getIcon(request.type);
          const tone = request.status === 'approved' ? 'green' : request.status === 'rejected' ? 'red' : 'orange';

          return (
            <HStack key={request.id} className={`items-center gap-3 rounded-lg border p-3 ${t.border.subtle}`}>
              <Box className={`h-10 w-10 items-center justify-center rounded-lg ${t.bg.purpleSoft}`}>
                <Icon size={20} color="#7c3aed" />
              </Box>
              <Box className="min-w-0 flex-1">
                <Text className={`font-bold ${t.text.primary}`}>{request.type}</Text>
                <Text className={`mt-2 ${t.text.secondary}`}>{request.dateRange}</Text>
                <Text className={`mt-1 ${t.text.secondary}`}>{request.duration}</Text>
              </Box>
              <StatusBadge label={request.status} tone={tone} />
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
