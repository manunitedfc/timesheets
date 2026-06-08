import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { CalendarDays, FileText, Heart, Users } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { t } from '@/constants/tokens';
import type { ActivityFeedItem } from '@/types';

type ActivityCardProps = {
  activities: ActivityFeedItem[];
  employeeMode?: boolean;
};

const toneStyles = {
  blue: { bg: 'bg-blue-50', color: '#2563eb', icon: FileText },
  green: { bg: 'bg-emerald-50', color: '#0f8a3b', icon: Users },
  orange: { bg: 'bg-orange-50', color: '#f97316', icon: CalendarDays },
  purple: { bg: 'bg-violet-50', color: '#7c3aed', icon: Heart },
};

export function ActivityCard({ activities, employeeMode = false }: ActivityCardProps) {
  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <HStack className="mb-3 items-center justify-between">
        <Text className={`text-base font-bold ${t.text.primary}`}>Recent Activity</Text>
        <Text
          className={`font-semibold ${employeeMode ? 'text-emerald-700' : 'text-blue-700'}`}
          onPress={() => router.push((employeeMode ? '/timesheets' : '/approvals') as Href)}
        >
          View all
        </Text>
      </HStack>
      <VStack className="gap-3">
        {activities.map((activity) => {
          const tone = toneStyles[activity.tone];
          const Icon = tone.icon;

          return (
            <HStack key={activity.id} className="items-center gap-3">
              <Box className={`h-6 w-6 items-center justify-center rounded-md ${tone.bg}`}>
                <Icon size={16} color={tone.color} />
              </Box>
              <Text className={`min-w-0 flex-1 ${t.text.secondary}`}>{activity.message}</Text>
              <Text className={`text-sm font-medium ${t.text.muted}`}>{activity.time}</Text>
            </HStack>
          );
        })}
      </VStack>
    </Card>
  );
}
