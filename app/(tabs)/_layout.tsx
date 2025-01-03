// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'folders') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'study') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="folders"
        options={{ title: 'Папки' }}
        href="/(tabs)/folders"
      />
      <Tabs.Screen name="study" options={{ title: 'Изучение' }} />
    </Tabs>
  );
}
