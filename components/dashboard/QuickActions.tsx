import type { LucideIcon } from 'lucide-react-native';
import {
  BarChart3,
  CalendarDays,
  CalendarPlus,
  Download,
  FileBarChart2,
  FilePlus,
  UserPlus,
} from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { COLORS } from '@/constants/colors';
import { ACTIVE_ROLE, hasAdminAccess } from '@/constants/roles';
import { t } from '@/constants/tokens';

type Action = { label: string; icon: LucideIcon };

const adminActions: Action[] = [
  { label: 'Add Timesheet', icon: FilePlus },
  { label: 'Add Time Off', icon: CalendarPlus },
  { label: 'Add User', icon: UserPlus },
  { label: 'Generate Report', icon: FileBarChart2 },
  { label: 'View Reports', icon: BarChart3 },
  { label: 'Export Data', icon: Download },
];

const employeeActions: Action[] = [
  { label: 'Add Timesheet', icon: FilePlus },
  { label: 'Request Time Off', icon: CalendarPlus },
  { label: 'View Calendar', icon: CalendarDays },
  { label: 'View Reports', icon: BarChart3 },
];

export function QuickActions() {
  const isAdmin = hasAdminAccess(ACTIVE_ROLE);
  const primary = isAdmin ? COLORS.admin.primary : COLORS.employee.primary;
  const actions = isAdmin ? adminActions : employeeActions;

  // Split into two columns manually so each item stays on one line
  const left = actions.filter((_, i) => i % 2 === 0);
  const right = actions.filter((_, i) => i % 2 !== 0);

  const renderAction = (action: Action) => {
    const Icon = action.icon;
    return (
      <Pressable
        key={action.label}
        className={`flex-row items-center gap-2.5 rounded-lg px-3 py-2 active:opacity-70 ${t.bg.elevated}`}
      >
        <Box
          className="items-center justify-center rounded-md"
          style={{ width: 32, height: 32, backgroundColor: `${primary}18` }}
        >
          <Icon size={16} color={primary} strokeWidth={2} />
        </Box>
        <Text className={`text-sm font-medium ${t.text.primary}`}>{action.label}</Text>
      </Pressable>
    );
  };

  return (
    <Card size="md" variant="outline" className={`flex-1 p-4 ${t.card}`}>
      <Text className={`mb-3 text-sm font-semibold uppercase tracking-wider ${t.text.secondary}`}>
        Quick Actions
      </Text>
      <HStack className="gap-2">
        <Box className="flex-1 gap-1.5">{left.map(renderAction)}</Box>
        <Box className="flex-1 gap-1.5">{right.map(renderAction)}</Box>
      </HStack>
    </Card>
  );
}
