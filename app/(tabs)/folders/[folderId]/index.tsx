// app/(tabs)/folders/[folderId]/index.tsx

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import FolderContent from '../FolderContent';

export default function NestedFolderScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: string }>();
  // Передаём folderId в универсальный компонент
  return <FolderContent folderId={folderId ?? null} />;
}