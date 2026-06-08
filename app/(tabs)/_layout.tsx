import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { MobileTabs } from '@/components/layout/MobileTabs';

export default function TabLayout() {
  // Platform.OS is a compile-time constant — no measurement, no flash.
  // Web navigation is handled by the sidebar; no tab bar needed on web.
  if (Platform.OS !== 'web') {
    return <MobileTabs />;
  }

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
