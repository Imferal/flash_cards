import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { CollectionsProvider } from '@/contexts/CollectionsContext';
// import { useEffect } from 'react';
// import { initDatabase } from '@/data/database';

export default function RootLayout() {
  // useEffect(() => {
  //   // Инициализируем базу данных при запуске приложения
  //   initDatabase().catch(console.error);
  // }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <CollectionsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        </Stack>
      </CollectionsProvider>
    </ThemeProvider>
  );
}
