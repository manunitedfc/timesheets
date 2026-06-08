import { usePathname } from 'expo-router';
import { Bell, ChevronDown, Search } from 'lucide-react-native';

import { AvatarInitials } from '@/components/shared/AvatarInitials';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { currentManager } from '@/data/employees';

const titles = Object.fromEntries(NAVIGATION_ITEMS.map((item) => [item.href, item.label]));

export function Header() {
  const pathname = usePathname();
  const title = titles[pathname] ?? 'Dashboard';

  return (
    <HStack className="h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/60 dark:bg-slate-900">
      <Text className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</Text>
      <HStack className="items-center gap-2">
        <HStack className="hidden lg:flex h-9 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
          <Search size={15} color="#94a3b8" />
          <Text className="text-sm text-slate-400 dark:text-slate-500">Search...</Text>
        </HStack>
        <ThemeToggle />
        <Box className="relative h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={19} color="#64748b" />
          <Box className="absolute right-1 top-1 h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1">
            <Text className="text-[10px] font-bold text-white">3</Text>
          </Box>
        </Box>
        <HStack className="items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          <AvatarInitials initials={currentManager.initials} size="sm" tone="admin" />
          <Box className="hidden lg:flex flex-row items-center gap-2">
            <VStack className="gap-0">
              <Text className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">{currentManager.name.split(' ')[0]}</Text>
              <Text className="text-xs leading-tight text-slate-400 dark:text-slate-500">{currentManager.title}</Text>
            </VStack>
            <ChevronDown size={14} color="#94a3b8" />
          </Box>
        </HStack>
      </HStack>
    </HStack>
  );
}
