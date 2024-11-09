import React, { createContext, useState, useEffect } from 'react';
import {
  getCollections,
  toggleCollectionSelection,
  initDatabase,
} from '@/data/database';

interface Collection {
  id: string;
  name: string;
  folderId: string | null;
  createdByUser: number;
  selected: number;
}

interface CollectionsContextType {
  collections: Collection[];
  toggleCollection: (id: string) => void;
}

export const CollectionsContext = createContext<CollectionsContextType>({
  collections: [],
  toggleCollection: () => {},
});

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await initDatabase();
      const data = await getCollections();
      setCollections(data);
    };
    loadData().catch(console.error);
  }, []);

  const toggleCollection = async (id: string) => {
    const collection = collections.find((col) => col.id === id);
    if (collection) {
      const newSelected = collection.selected ? 0 : 1;
      await toggleCollectionSelection(id, newSelected);
      // Обновляем состояние после изменения
      const updatedCollections = await getCollections();
      setCollections(updatedCollections);
    }
  };

  return (
    <CollectionsContext.Provider value={{ collections, toggleCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
};
