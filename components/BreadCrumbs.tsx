// components/BreadCrumbs.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Crumb {
  id: string | null; // null → значит “корень”
  name: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[]; // Массив крошек (может быть: [{ id: null, name: 'Домой'}, {...} ... ])
  isLastElementClickable?: boolean;
}

export default function BreadCrumbs(
  {
    crumbs,
    isLastElementClickable = false, // По умолчанию последняя крошка не кликабельна
  }: BreadCrumbsProps,
) {
  const theme = useTheme();

  // Рендер одной крошки
  // Иначе — кликабельным (или через <Link>).
  const renderCrumbs = crumbs.map((crumb, index) => {
    const isLast = index === crumbs.length - 1;
    const textStyle = isLast ? styles.currentCrumb : styles.linkCrumb;

    return (
      <View key={crumb.id ?? `root-${index}`} style={styles.crumbWrapper}>
        <Text style={[styles.separator, { color: theme.colors.onSurface }]}>
          {' / '}
        </Text>

        {isLast && !isLastElementClickable ? (
          // По-умолчанию последняя крошка не кликабельна
          <Text style={[textStyle, { color: theme.colors.onSurface }]}>
            {crumb.name}
          </Text>
        ) : (
          // Иначе, если мы хотим использовать Link (expo-router)
          <Link href={`/folders/${crumb.id}`} style={[textStyle, { color: theme.colors.primary }]}>
            {crumb.name}
          </Link>
        )}
      </View>
    );
  });

  return (
    <Surface style={styles.container} elevation={0}>
      {/* Иконка "домой" */}
      <Link href="/folders" style={styles.icon}>
        <MaterialIcons
          name="home"
          size={24}
          color={theme.colors.onSurface}
          style={styles.icon}
        />
      </Link>

      {/* Рендер массива крошек */}
      <View style={styles.crumbsRow}>
        {renderCrumbs}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  crumbsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 4,
  },
  crumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 16,
  },
  currentCrumb: {
    fontSize: 16,
    fontWeight: '500',
  },
  linkCrumb: {
    fontSize: 16,
  },
  icon: {
    marginRight: 4,
  },
});