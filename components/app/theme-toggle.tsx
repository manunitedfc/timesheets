import { Moon, Sun } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { setStoredColorScheme, useAppColorScheme } from '@/lib/theme/color-scheme';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const colorScheme = useAppColorScheme();
  const isDark = colorScheme === 'dark';
  const nextScheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? Sun : Moon;

  function toggleTheme() {
    setStoredColorScheme(nextScheme);
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={`Switch to ${nextScheme} mode`}
      accessibilityState={{ checked: isDark }}
      onPress={toggleTheme}
      className={`flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${
        compact ? 'h-11 w-11 px-0' : 'px-3 py-2.5'
      }`}>
      <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Icon size={15} color={isDark ? '#facc15' : '#475569'} />
      </View>
      {!compact ? (
        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          {isDark ? 'Light' : 'Dark'}
        </Text>
      ) : null}
    </Pressable>
  );
}
