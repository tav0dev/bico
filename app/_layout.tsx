import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { BicoProvider, useBico } from '@/context/bico-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isReady, isAuthenticated, isDark, tokens } = useBico();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const firstSegment = segments[0];
    const isPublicRoute = firstSegment === 'login' || firstSegment === 'onboarding' || firstSegment === 'login-callback';

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isReady, router, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.bg }}>
        <ActivityIndicator color={tokens.green} />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="login-callback" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="inbox-thread" />
        <Stack.Screen name="services" />
        <Stack.Screen name="create-post" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <BicoProvider>
      <RouteGuard />
    </BicoProvider>
  );
}
