import { BarChart3, CalendarDays, Download, Plus, UserPlus } from 'lucide-react-native';
import { Platform, useWindowDimensions } from 'react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { COLORS } from '@/constants/colors';
import { ACTIVE_ROLE, hasAdminAccess } from '@/constants/roles';
import { t } from '@/constants/tokens';

const adminActions = [
  { label: 'Add Timesheet', icon: Plus },
  { label: 'Add Time Off', icon: Plus },
  { label: 'Add User', icon: UserPlus },
  { label: 'Generate Report', icon: BarChart3 },
  { label: 'View Reports', icon: BarChart3 },
  { label: 'Export Data', icon: Download },
];

const employeeActions = [
  { label: 'Add Timesheet', icon: Plus },
  { label: 'Request Time Off', icon: Plus },
  { label: 'View Calendar', icon: CalendarDays },
  { label: 'View Reports', icon: BarChart3 },
];

export function QuickActions() {
  const { width } = useWindowDimensions();
  const isAdmin = hasAdminAccess(ACTIVE_ROLE);
  const primary = isAdmin ? COLORS.admin.primary : COLORS.employee.primary;
  const actions = isAdmin ? adminActions : employeeActions;
  const twoColumns = Platform.OS === 'web' || width > 420;

  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 lg:p-3 ${t.card}`}>
      <Text className={`mb-3 text-base font-bold ${t.text.primary}`}>Quick Actions</Text>
      <Box style={{ flexDirection: twoColumns ? 'row' : 'column', flexWrap: 'wrap', gap: 8 }}>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Pressable
              key={action.label}
              className={`h-11 flex-1 basis-[44%] items-center justify-center rounded-lg border ${t.border.strong} ${t.bg.elevated}`}
            >
              <HStack className="items-center justify-center gap-3">
                <Icon size={21} color={primary} />
                <Text className="font-bold" style={{ color: primary }}>
                  {action.label}
                </Text>
              </HStack>
            </Pressable>
          );
        })}
      </Box>
    </Card>
  );
}
