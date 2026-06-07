import { Bell } from 'lucide-react-native';
import { Platform } from 'react-native';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { COLORS } from '@/constants/colors';
import { ACTIVE_ROLE, hasAdminAccess } from '@/constants/roles';
import { t } from '@/constants/tokens';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const isAdmin = hasAdminAccess(ACTIVE_ROLE);
  const primary = isAdmin ? COLORS.admin.primary : COLORS.employee.primary;

  return (
    <HStack className="mb-4 items-start justify-between">
      <Box className="min-w-0 flex-1">
        <Text className={`text-2xl font-bold ${t.text.primary}`}>{title}</Text>
        {subtitle ? <Text className={`mt-1 text-sm ${t.text.muted}`}>{subtitle}</Text> : null}
      </Box>
      {Platform.OS !== 'web' ? (
        <Box className={`h-10 w-10 items-center justify-center rounded-full ${t.bg.surface}`}>
          <Bell size={21} color={primary} />
        </Box>
      ) : null}
    </HStack>
  );
}
