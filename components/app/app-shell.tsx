import { router, Slot, usePathname } from 'expo-router';
import {
  BadgeCheck,
  BarChart3,
  CalendarMinus2,
  Clock3,
  LayoutDashboard,
  UserRound,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { desktopNavItems, mobileNavItems, type NavItem } from '@/components/app/mock-data';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useAppColorScheme } from '@/lib/theme/color-scheme';

const companyLogo = require('@/assets/images/Company Logo.png');

const styles = StyleSheet.create({
  desktopLogo: {
    width: 168,
    height: 54,
  },
});

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
  const colorScheme = useAppColorScheme();
  const active = isActivePath(pathname, item.href);
  const Icon = iconMap[item.icon];
  const iconColor = active ? (colorScheme === 'dark' ? '#f8fafc' : '#1764ff') : colorScheme === 'dark' ? '#cbd5e1' : '#475569';
  const activeTextClass = active ? 'text-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.replace(item.href)}
      className={`flex-row items-center rounded-2xl ${compact ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'} ${
        active ? 'border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800' : 'border border-transparent bg-transparent'
      }`}>
      <Icon color={iconColor} size={18} />
      {!compact ? (
        <Text className={`text-sm font-medium ${activeTextClass}`}>{item.label}</Text>
      ) : null}
    </Pressable>
  );
}

function DesktopSidebar() {
  const colorScheme = useAppColorScheme();
  const logoTintColor = colorScheme === 'dark' ? '#ffffff' : '#020617';

  return (
    <View className="hidden w-[224px] self-stretch border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 xl:w-[240px] xl:px-5 xl:py-6 2xl:w-[280px] lg:flex">
      <View className="h-16 w-full items-center justify-center overflow-hidden px-2">
        <Image source={companyLogo} resizeMode="contain" style={[styles.desktopLogo, { tintColor: logoTintColor }]} />
      </View>

      <View className="mt-8 gap-2 xl:mt-10">
        {desktopNavItems.map((item) => (
          <NavButton key={item.href} item={item} />
        ))}
      </View>

      <View className="mt-auto gap-3">
        <ThemeToggle />
        <View className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/80 xl:p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#1764ff]">
              <Text className="text-base font-semibold text-white">TC</Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-sm font-semibold text-slate-950 dark:text-white xl:text-[15px]">
                Thomas Carter
              </Text>
              <Text numberOfLines={1} className="mt-1 text-xs text-slate-500 dark:text-slate-400 xl:text-sm">
                Senior Field Engineer
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const colorScheme = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(6, Math.min(insets.bottom, 10));

  return (
    <View
      className="border-t border-slate-200 bg-white px-2 pt-1.5 dark:border-slate-800 dark:bg-slate-950"
      style={{ paddingBottom: bottomInset }}>
      <View className="flex-row justify-between gap-1">
        {mobileNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = iconMap[item.icon];
          const iconColor = active ? (colorScheme === 'dark' ? '#f8fafc' : '#1455d9') : colorScheme === 'dark' ? '#cbd5e1' : '#64748b';
          const activeTextClass = active ? 'text-slate-950 dark:text-white' : 'text-slate-500 dark:text-slate-400';
          return (
            <Pressable
              key={item.href}
              accessibilityRole="button"
              onPress={() => router.replace(item.href)}
              className={`flex-1 items-center rounded-xl border py-1.5 ${
                active ? 'border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800' : 'border-transparent bg-transparent'
              }`}>
              <Icon color={iconColor} size={18} />
              <Text className={`mt-0.5 text-center text-[10px] font-medium ${activeTextClass}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AppShell() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'right', 'left']}>
      <View className="min-h-0 flex-1 lg:flex-row">
        <DesktopSidebar />

        <View className="min-h-0 flex-1">
          <Slot />
          <View className="flex lg:hidden">
            <MobileBottomNav />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
