// app/_layout.tsx

import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { CollectionsProvider } from '@/contexts/CollectionsContext';
import { PaperProvider } from 'react-native-paper';
import {
  autumnGlowTheme,
  cozySunsetTheme, honeyCinnamonTheme, warmCocoaTheme,
} from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <PaperProvider theme={honeyCinnamonTheme}>
        <CollectionsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)"/>
          </Stack>
        </CollectionsProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
