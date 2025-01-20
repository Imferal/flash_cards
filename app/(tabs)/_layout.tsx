// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme(); // Подключаем тему

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'folders') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'study') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // Задний фон вкладки
          borderTopColor: theme.colors.onSurfaceVariant, // Цвет верхней границы табов
        },
        tabBarActiveTintColor: theme.colors.onSurfaceVariant, // Цвет активного таба
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant, // Цвет неактивного таба
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '400',
        },
      })}
    >
      <Tabs.Screen
        name="folders"
        options={{ title: 'Коллекции' }}
        href="/(tabs)/folders"
      />
      <Tabs.Screen name="study" options={{ title: 'Учить' }} />
    </Tabs>
  );
}
