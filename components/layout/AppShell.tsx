import type { ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { Box } from '@/components/ui/box';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 768;

  if (!isDesktopWeb) {
    return <Box className="flex-1 bg-white dark:bg-slate-950">{children}</Box>;
  }

  return (
    <Box className="h-screen flex-1 flex-row bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Box className="min-w-0 flex-1">
        <Header />
        <Box className="min-h-0 flex-1">{children}</Box>
      </Box>
    </Box>
  );
}
