// data/collections.db.ts

import { db } from './database'; // <-- предполагаем, что database.ts экспортирует db
import uuid from 'react-native-uuid';
import { Collection, Folder } from '@/data/types';

/** Функция для добавления новой коллекции */
export const addCollection = async (
  name: string,
  folderId: string | null = null,
  createdByUser: number = 1,
  selected: number = 0): Promise<string | null> => {

  const id = uuid.v4() as string;

  try {
    await db.runAsync(
      'INSERT INTO collections (id, name, folderId, createdByUser, selected) VALUES (?, ?, ?, ?, ?);',
      id,
      name,
      folderId,
      createdByUser,
      selected
    );
    console.log('Коллекция добавлена, id: ', id);
    return id;
  } catch (error) {
    console.error('Ошибка при добавлении коллекции:', error);
    return null;
  }
};

export const addCollectionWithId = async (id: string, name: string, folderId: string | null = null, createdByUser: number = 1, selected: number = 0) => {
  try {
    await db.runAsync(
      'INSERT INTO collections (id, name, folderId, createdByUser, selected) VALUES (?, ?, ?, ?, ?);',
      id, name, folderId, createdByUser, selected
    );
    console.log('Collection added');
  } catch (error) {
    console.error('Error adding collection:', error);
  }
};

export const getCollections = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM collections;');
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};

export const getSelectedCollections = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM collections WHERE selected = 1;');
  } catch (error) {
    console.error('Error getting selected collections:', error);
    return [];
  }
};

/** Функция для переименования коллекции */
export const renameCollection = async (id: string, newName: string): Promise<void> => {
  try {
    await db.runAsync(
      'UPDATE collections SET name = ? WHERE id = ?;',
      newName,
      id
    );
    console.log('Коллекция переименована');
  } catch (error) {
    console.error('Ошибка при переименовании коллекции:', error);
  }
};

/** Функция для получения коллекций по folderId */
export const getCollectionsByFolderId = async (folderId: string | null): Promise<Collection[]> => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM collections WHERE folderId IS ?;',
      folderId
    );
  } catch (error) {
    console.error('Ошибка при получении коллекций по папке:', error);
    return [];
  }
};

export const moveCollection = async (collectionId: string, newFolderId: string | null) => {
  try {
    await db.runAsync('UPDATE collections SET folderId = ? WHERE id = ?;', newFolderId, collectionId);
    console.log('Collection moved');
  } catch (error) {
    console.error('Error moving collections:', error)
  }
}

export const toggleCollectionSelection = async (collectionId: string, selected: boolean) => {
  try {
    await db.runAsync(
      'UPDATE collections SET selected = ? WHERE id = ?;',
      selected ? 0 : 1, collectionId
    );
    console.log('Collection selection status updated');
  } catch (error) {
    console.error('Error updating collection selection status:', error);
  }
};

/** Функция для удаления папки */
export const deleteCollection = async (id: string): Promise<void> => {
  try {
    // Удаляем все вложенные папки и коллекции рекурсивно
    await db.runAsync('DELETE FROM collections WHERE id = ?;', id);

    console.log('Коллекция удалена');
  } catch (error) {
    console.error('Ошибка при удалении коллекции:', error);
  }
};



