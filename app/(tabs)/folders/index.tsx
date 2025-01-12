// app/(tabs)/folders/CardsScreen.tsx

import React from 'react';
import FolderContent from './FolderContent';
import DevPanel from '@/components/devPanel';

export default function RootFoldersScreen() {
  // Для корня папок: folderId = null
  return <>
    <FolderContent folderId={null}/>
    <DevPanel/>
  </>;
}