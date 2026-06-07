import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Pressable } from '@/components/ui/pressable';

export function ThemeToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconSize = size === 'sm' ? 16 : 18;
  const boxSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

  return (
    <Pressable
      onPress={toggleColorScheme}
      className={`${boxSize} items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800`}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="button"
    >
      {isDark
        ? <Sun size={iconSize} color="#f59e0b" />
        : <Moon size={iconSize} color="#64748b" />
      }
    </Pressable>
  );
}
