// app/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { CollectionsProvider } from '@/contexts/CollectionsContext';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { honeyCinnamonTheme } from '@/theme';
import { enableScreens } from 'react-native-screens';

// Это требуется для того, чтобы React Navigation мог использовать оптимизированные ViewManagers от react-native-screens.
enableScreens();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <PaperProvider theme={honeyCinnamonTheme}>
          <CollectionsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          </CollectionsProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
