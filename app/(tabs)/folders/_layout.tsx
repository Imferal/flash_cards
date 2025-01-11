// app/(tabs)/folders/_layout.tsx

import { Stack } from 'expo-router';

export default function FoldersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
