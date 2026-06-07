import type { ReactNode } from 'react';
import { Platform, ScrollView } from 'react-native';

import { t } from '@/constants/tokens';

type ScreenContainerProps = {
  children: ReactNode;
};

export function ScreenContainer({ children }: ScreenContainerProps) {
  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      className={`flex-1 ${t.bg.page}`}
      contentContainerStyle={{
        alignSelf: 'center',
        maxWidth: isWeb ? 1440 : undefined,
        padding: isWeb ? 24 : 20,
        paddingTop: isWeb ? 20 : 58,
        paddingBottom: isWeb ? 28 : 112,
        width: '100%',
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
