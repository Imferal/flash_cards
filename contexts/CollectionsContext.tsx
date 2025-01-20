// contexts/CollectionsContext.tsx

import React, { createContext, useEffect, useState } from 'react';
import { initDatabase } from '@/data/database';
import { Text } from 'react-native';
import { getCollections, setCollectionSelected } from '@/data/collections.db.ts';

interface Collection {
  id: string;
  name: string;
  folderId: string | null;
  createdByUser: number;
  selected: boolean;
}

interface CollectionsContextType {
  collections: Collection[];
  toggleCollection: (id: string, newValue: boolean) => void;
  reloadCollections: () => Promise<void>;
}

export const CollectionsContext = createContext<CollectionsContextType>({
  collections: [],
  toggleCollection: () => {
  },
  reloadCollections: async () => {
  },
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
  const toggleCollection = async (id: string, newSelectedValue: boolean) => {
    // Локально меняем в стейте, что эта коллекция теперь selected = newSelectedValue
    setCollections(prev => prev.map(col =>
      col.id === id
        ? { ...col, selected: newSelectedValue }
        : col
    ));

    try {
      await setCollectionSelected(id, newSelectedValue);
      console.log('Коллекция обновлена');
    } catch (error) {
      console.error('Ошибка при обновлении коллекции', error);
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
