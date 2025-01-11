// app/_layout.tsx

import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { CollectionsProvider } from '@/contexts/CollectionsContext';
import { PaperProvider } from 'react-native-paper';
import {
  cozySunsetTheme, warmCocoaTheme,
} from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <PaperProvider theme={warmCocoaTheme}>
        <CollectionsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)"/>
          </Stack>
        </CollectionsProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
