// contexts/CollectionsContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import {
  getCollections,
  toggleCollectionSelection,
  initDatabase,
} from '@/data/database';
import { Text } from 'react-native';

interface Collection {
  id: string;
  name: string;
  folderId: string | null;
  createdByUser: number;
  selected: boolean;
}

interface CollectionsContextType {
  collections: Collection[];
  toggleCollection: (id: string) => void;
  reloadCollections: () => Promise<void>;
}

export const CollectionsContext = createContext<CollectionsContextType>({
  collections: [],
  toggleCollection: () => {},
  reloadCollections: async () => {},
});

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isDBReady, setIsDBReady] = useState(false);

  // Инициализация базы и загрузка "collections" один раз при старте
  useEffect(() => {
    const loadData = async () => {
      await initDatabase();
      setIsDBReady(true);

      // Начальная загрузка
      const data = await getCollections();
      setCollections(data);
    };
    loadData().catch(console.error);
  }, []);

  // Метод для переключения selected
  const toggleCollection = async (id: string) => {
    const collection = collections.find((col) => col.id === id);
    if (collection) {
      await toggleCollectionSelection(id, collection.selected);
      // После переключения — перезагружаем весь список
      const updatedCollections = await getCollections();
      setCollections(updatedCollections);
    }
  };

  // Принудительно перезагружает весь список "collections"
  const reloadCollections = async () => {
    const updated = await getCollections();
    setCollections(updated);
  };

  if (!isDBReady) {
    // Пока база не готова — показываем Loading
    return <Text style={{ marginTop: 100 }}>Loading database...</Text>;
  }

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        toggleCollection,
        reloadCollections,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};
