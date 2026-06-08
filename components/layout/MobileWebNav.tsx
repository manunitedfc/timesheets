import type { Href } from 'expo-router';
import { router, usePathname } from 'expo-router';
import { BarChart3, CalendarDays, CheckSquare, FileText, Home, User, Users } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { getNavigationItems, type NavigationIcon } from '@/constants/navigation';
import { ACTIVE_ROLE } from '@/constants/roles';

const iconMap = {
  dashboard: Home,
  timesheets: FileText,
  timeOff: CalendarDays,
  approvals: CheckSquare,
  reports: BarChart3,
  users: Users,
  profile: User,
} satisfies Record<NavigationIcon, typeof Home>;

/**
 * Bottom navigation bar for mobile web (< lg breakpoint).
 * Rendered inside AppShell with `flex lg:hidden` — shown on narrow screens,
 * hidden on desktop where the sidebar takes over. Zero JS measurement.
 */
export function MobileWebNav() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const items = getNavigationItems(ACTIVE_ROLE, 'mobile');

  const activeColor = '#2563eb';
  const inactiveColor = isDark ? '#94a3b8' : '#475569';
  const bg = isDark ? '#0f172a' : '#ffffff';
  const border = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <Box
      style={{
        flexDirection: 'row',
        height: 64,
        backgroundColor: bg,
        borderTopWidth: 1,
        borderTopColor: border,
      }}
    >
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const active = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
        const color = active ? activeColor : inactiveColor;

        return (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as Href)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <Icon size={20} color={color} />
            <Text style={{ fontSize: 10, fontWeight: '700', color }}>{item.label}</Text>
          </Pressable>
        );
      })}
    </Box>
  );
}
