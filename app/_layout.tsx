// app/_layout.tsx

import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { CollectionsProvider } from '@/contexts/CollectionsContext';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <CollectionsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </CollectionsProvider>
    </ThemeProvider>
  );
}
