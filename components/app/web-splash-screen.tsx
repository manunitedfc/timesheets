import { useEffect } from 'react';
import { Platform } from 'react-native';

export function WebSplashScreen() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const timer = window.setTimeout(() => {
      document.getElementById('initial-web-splash')?.remove();
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
