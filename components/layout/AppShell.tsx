import type { ReactNode } from 'react';
import { Platform } from 'react-native';

import { Box } from '@/components/ui/box';
import { Header } from './Header';
import { MobileWebNav } from './MobileWebNav';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  // Native (iOS/Android): no shell, the tab navigator handles chrome
  if (Platform.OS !== 'web') {
    return <Box className="flex-1 bg-white dark:bg-slate-950">{children}</Box>;
  }

  // Web: render sidebar AND mobile nav — CSS breakpoints decide which is visible.
  //   < lg  → sidebar hidden, header hidden, mobile bottom nav visible
  //   ≥ lg  → sidebar visible, header visible, mobile bottom nav hidden
  // Zero JS measurement. No flash possible.
  return (
    <Box className="h-screen flex-1 flex-row bg-slate-50 dark:bg-slate-950">
      {/* Sidebar: desktop only */}
      <Box className="hidden lg:flex">
        <Sidebar />
      </Box>

      <Box className="min-w-0 flex-1 flex-col">
        {/* Header: desktop only */}
        <Box className="hidden lg:flex">
          <Header />
        </Box>

        {/* Page content */}
        <Box className="min-h-0 flex-1">
          {children}
        </Box>

        {/* Bottom nav: mobile web only */}
        <Box className="flex lg:hidden">
          <MobileWebNav />
        </Box>
      </Box>
    </Box>
  );
}
