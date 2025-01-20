// app/(tabs)/folders/CardsScreen.tsx

import React from 'react';
import FolderContent from './FolderContent';

export default function RootFoldersScreen() {
  // Для корня папок: folderId = null
  return <>
    <FolderContent folderId={null}/>
    {/*<DevPanel/>*/}
  </>;
}