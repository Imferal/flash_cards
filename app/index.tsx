// app/CardsScreen.tsx

import { Redirect } from 'expo-router';

export default function Index() {
  // При входе в приложение редирект на экран папок
  return <Redirect href="/(tabs)/folders" />;
}