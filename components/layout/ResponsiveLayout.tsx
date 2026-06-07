import type { ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { Box } from '@/components/ui/box';

type ResponsiveLayoutProps = {
  children: ReactNode;
  gap?: number;
  minWideWidth?: number;
};

export function ResponsiveLayout({
  children,
  gap = 16,
  minWideWidth = 900,
}: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= minWideWidth;

  return (
    <Box
      style={{
        flexDirection: isWide ? 'row' : 'column',
        flexWrap: isWide ? 'wrap' : 'nowrap',
        gap,
      }}
    >
      {children}
    </Box>
  );
}
