import { router, Slot, usePathname } from 'expo-router';
import {
  BadgeCheck,
  BarChart3,
  CalendarMinus2,
  Clock3,
  LayoutDashboard,
  Menu,
  Search,
  UserRound,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { desktopNavItems, mobileNavItems, type NavItem } from '@/components/app/mock-data';

const iconMap: Record<NavItem['icon'], LucideIcon> = {
  'badge-check': BadgeCheck,
  'bar-chart-3': BarChart3,
  'calendar-minus-2': CalendarMinus2,
  'clock-3': Clock3,
  'layout-dashboard': LayoutDashboard,
  'user-round': UserRound,
  users: Users,
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavButton({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = iconMap[item.icon];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.replace(item.href)}
      className={`flex-row items-center rounded-2xl ${compact ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'} ${
        active ? 'bg-slate-950' : 'bg-transparent'
      }`}>
      <Icon color={active ? '#F8FAFC' : '#475569'} size={18} />
      {!compact ? (
        <Text className={`text-sm font-medium ${active ? 'text-slate-50' : 'text-slate-600'}`}>{item.label}</Text>
      ) : null}
    </Pressable>
  );
}

function MobileHeader() {
  return (
    <View className="border-b border-slate-200 bg-white px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Northwind Ops</Text>
          <Text className="mt-1 text-xl font-semibold text-slate-950">Workforce Hub</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <Menu size={18} color="#0f172a" />
        </View>
      </View>
    </View>
  );
}

function DesktopSidebar() {
  return (
    <View className="hidden w-[224px] self-stretch border-r border-slate-200 bg-[#0f172a] px-4 py-5 xl:w-[240px] xl:px-5 xl:py-6 2xl:w-[280px] lg:flex">
      <Text className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Northwind Ops</Text>
      <Text className="mt-2 text-xl font-semibold text-white xl:text-2xl">Workforce Hub</Text>
      <Text className="mt-2 text-xs leading-5 text-slate-400 xl:text-sm xl:leading-6">
        Enterprise timesheets, approvals, and staffing visibility in one workspace.
      </Text>

      <View className="mt-6 gap-2 xl:mt-8">
        {desktopNavItems.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </View>

      <View className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-3 xl:p-4">
        <Text className="text-sm font-medium text-white">Quarter close</Text>
        <Text className="mt-2 text-xs leading-5 text-slate-400 xl:text-sm xl:leading-6">
          Payroll export is due Friday. Keep approvals under 24 hours to stay on track.
        </Text>
      </View>
    </View>
  );
}

function DesktopHeader() {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-6 py-3 xl:px-8 xl:py-4">
      <View className="w-full max-w-sm flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 xl:max-w-md">
        <Search size={18} color="#64748b" />
        <Text className="text-sm text-slate-400">Search timesheets, people, reports</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Text className="text-sm font-medium text-slate-700">Current cycle: Jun 3 - Jun 9</Text>
        </View>
        <View className="rounded-2xl bg-slate-950 px-4 py-3">
          <Text className="text-sm font-medium text-slate-50">Thomas Carter</Text>
        </View>
      </View>
    </View>
  );
}

function MobileBottomNav() {
  return (
    <View className="border-t border-slate-200 bg-white px-2 pb-4 pt-2">
      <View className="flex-row justify-between gap-1">
        {mobileNavItems.map((item) => (
          <View key={item.href} className="flex-1">
            <NavButton item={item} compact />
            <Text className="mt-1 text-center text-[11px] font-medium text-slate-500">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function AppShell() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top', 'right', 'left']}>
      <View className="flex-1 lg:flex-row">
        <DesktopSidebar />

        <View className="flex-1">
          <View className="flex lg:hidden">
            <MobileHeader />
          </View>
          <View className="hidden lg:flex">
            <DesktopHeader />
          </View>
          <Slot />
          <View className="flex lg:hidden">
            <MobileBottomNav />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
