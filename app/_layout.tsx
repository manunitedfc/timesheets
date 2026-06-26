import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { WebSplashScreen } from '@/components/app/web-splash-screen';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { initializeColorScheme, useAppColorScheme } from '@/lib/theme/color-scheme';

initializeColorScheme();

export const unstable_settings = {
  anchor: '(app)',
};

export default function RootLayout() {
  const resolvedColorScheme = useAppColorScheme();

  return (
    <GluestackUIProvider mode={resolvedColorScheme}>
      <ThemeProvider value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(app)" />
        </Stack>
        <WebSplashScreen />
        <StatusBar style={resolvedColorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
