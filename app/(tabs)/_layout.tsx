import { Stack } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';

import { MobileTabs } from '@/components/layout/MobileTabs';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 768;

  if (isDesktopWeb) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="timesheets" />
        <Stack.Screen name="time-off" />
        <Stack.Screen name="profile" />
      </Stack>
    );
  }

  return <MobileTabs />;
}
