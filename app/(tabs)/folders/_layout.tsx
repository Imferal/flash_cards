// app/(tabs)/folders/_layout.tsx

import { Stack } from 'expo-router';

export default function FoldersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Stack.Screen name="index" → соответствует файлу index.tsx */}
      {/* Stack.Screen name="[folderId]/index" → вложенные папки */}
      <Stack.Screen name="index" options={{ title: 'Папки' }} />
    </Stack>
  );
}
