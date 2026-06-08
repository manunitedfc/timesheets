import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { router, usePathname } from 'expo-router';
import {
    BarChart3,
    CalendarDays,
    CheckSquare,
    Clock3,
    FileText,
    Home,
    User,
    Users,
} from 'lucide-react-native';
import { Platform } from 'react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getNavigationItems, type NavigationIcon } from '@/constants/navigation';
import { ACTIVE_ROLE } from '@/constants/roles';
import { getCurrentManager } from '@/data/mockSelectors';
import { useColorScheme } from '@/hooks/use-color-scheme';

const logoSrc = require('@/assets/images/Company Logo Revised.png');

const iconMap = {
  dashboard: Home,
  timesheets: FileText,
  timeOff: CalendarDays,
  approvals: CheckSquare,
  reports: BarChart3,
  users: Users,
  profile: User,
} satisfies Record<NavigationIcon, typeof Home>;

export function Sidebar() {
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  const items = getNavigationItems(ACTIVE_ROLE, 'web');
  const currentManager = getCurrentManager();

  const iconColor = dark ? '#ffffff' : '#475569';
  const activeIconColor = '#ffffff';

  return (
    // w-14 below lg breakpoint, w-56 at lg+ — CSS decides, zero JS measurement
    <Box className="h-full w-14 lg:w-56 justify-between border-r border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
      {/* Logo row */}
      <Box className="h-16 items-center justify-center px-2 lg:px-3">
        {/* Icon-only: visible below lg */}
        <Box className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/15">
          <Clock3 size={20} color={dark ? '#ffffff' : '#2563eb'} />
        </Box>
        {/* Full logo: visible at lg+ */}
        <Box className="hidden lg:flex w-full">
          {Platform.OS === 'web' ? (
            // Plain <img> on web: browser renders it natively before React mounts,
            // so it never disappears on refresh.
            <img
              src={logoSrc}
              style={{ width: '100%', height: 44, objectFit: 'contain' }}
              alt="Company Logo"
            />
          ) : (
            <Image
              source={logoSrc}
              style={{ width: '100%', height: 44 }}
              contentFit="contain"
              contentPosition="center"
              cachePolicy="memory"
            />
          )}
        </Box>
      </Box>
      <VStack className="flex-1 justify-between py-4">
        <VStack className="gap-0.5 pt-3 px-2 lg:px-3">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as Href)}
                className={`rounded-lg items-center px-2 py-2.5 lg:px-3 lg:py-2 ${active ? 'bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                {/* Icon only: visible below lg */}
                <Box className="flex lg:hidden">
                  <Icon size={18} color={active ? activeIconColor : iconColor} />
                </Box>
                {/* Icon + label: visible at lg+ */}
                <HStack className="hidden lg:flex items-center gap-3">
                  <Icon size={17} color={active ? activeIconColor : iconColor} />
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{item.label}</Text>
                </HStack>
              </Pressable>
            );
          })}
        </VStack>
        <Box className="border-t border-slate-200 dark:border-slate-700/50 pt-4 items-center px-2 lg:px-3">
          {/* Icon-only avatar: visible below lg */}
          <Box className="flex lg:hidden">
            <AvatarInitials initials={currentManager.initials} size="sm" tone="admin" />
          </Box>
          {/* Full user row: visible at lg+ */}
          <HStack className="hidden lg:flex items-center gap-3">
            <AvatarInitials initials={currentManager.initials} tone="admin" />
            <Box className="min-w-0 flex-1">
              <Text className="font-bold text-slate-800 dark:text-white">{currentManager.name}</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400">{currentManager.title}</Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
