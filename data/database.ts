// data/database.ts

import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import foldersData from './folders.json';
import englishVerbsCollection from './collections/english_irregular_verbs.json';
import kazakhWordsCollection from './collections/kazakh_common_words.json';
import { Collection, Folder } from '@/data/types';

const foldersDataTyped: Folder[] = foldersData as Folder[];
const englishVerbsCollectionTyped: Collection = englishVerbsCollection as Collection;
const kazakhWordsCollectionTyped: Collection = kazakhWordsCollection as Collection;

let db: SQLiteDatabase;

export const initDatabase = async () => {
  try {
    db = await openDatabaseAsync('flashcards.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        parentFolderId TEXT,
        createdByUser INTEGER,
        FOREIGN KEY (parentFolderId) REFERENCES folders(id)
      );
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        folderId TEXT,
        createdByUser INTEGER,
        selected INTEGER DEFAULT 0,
        FOREIGN KEY (folderId) REFERENCES folders(id)
      );
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY NOT NULL,
        frontText TEXT NOT NULL,
        backText TEXT NOT NULL,
        collectionId TEXT,
        createdByUser INTEGER,
        FOREIGN KEY (collectionId) REFERENCES collections(id)
      );
    `);

    console.log('База данных инициализирована');

    await loadInitialData();
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
  }
};

const loadInitialData = async () => {
  const isDataLoaded = await AsyncStorage.getItem('dataLoaded');
  if (isDataLoaded) return;

  for (const folder of foldersDataTyped) {
    await addFolderWithId(folder.id, folder.name, folder.parentFolderId, folder.createdByUser);
  }

  const collections = [englishVerbsCollectionTyped, kazakhWordsCollectionTyped];

  for (const collection of collections) {
    await addCollectionWithId(
      collection.id,
      collection.name,
      collection.folderId,
      collection.createdByUser,
      collection.selected
    );

    for (const card of collection.cards) {
      await addCard(
        card.frontText,
        card.backText,
        collection.id,
        collection.createdByUser
      );
    }
  }

  await AsyncStorage.setItem('dataLoaded', 'true');
};

export const addFolderWithId = async (id: string, name: string, parentFolderId: string | null = null, createdByUser: number = 1) => {
  try {
    await db.runAsync(
      'INSERT INTO folders (id, name, parentFolderId, createdByUser) VALUES (?, ?, ?, ?);',
      id, name, parentFolderId, createdByUser
    );
    console.log('Folder added');
  } catch (error) {
    console.error('Error adding folder:', error);
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

export const addCard = async (frontText: string, backText: string, collectionId: string, createdByUser: number = 1) => {
  const id = uuid.v4() as string;
  try {
    await db.runAsync(
      'INSERT INTO cards (id, frontText, backText, collectionId, createdByUser) VALUES (?, ?, ?, ?, ?);',
      id, frontText, backText, collectionId, createdByUser
    );
  } catch (error) {
    console.error('Error adding card:', error);
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

export const getFolders = async (): Promise<Folder[]> => {
  try {
    return await db.getAllAsync('SELECT * FROM folders;');
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

export const moveFolder = async (folderId: string, newFolderId: string | null) => {
  try {
    await db.runAsync('UPDATE folders SET parentFolderId = ? WHERE id = ?;', newFolderId, folderId);
    console.log('Folder moved');
  } catch (error) {
    console.error('Error moving folder:', error)
  }
}

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

export const getSelectedCollections = async () => {
  try {
    return await db.getAllAsync('SELECT * FROM collections WHERE selected = 1;');
  } catch (error) {
    console.error('Error getting selected collections:', error);
    return [];
  }
};

/** Рекурсивно находит все потомки (child, grandchild...) */
export async function getAllDescendants(folderId: string): Promise<string[]> {
  const subFolders = await getFoldersByParentId(folderId);
  let ids: string[] = subFolders.map(sf => sf.id);

  for (const sf of subFolders) {
    const deeper = await getAllDescendants(sf.id);
    ids.push(...deeper);
  }

  return ids;
}

export const getCardsByCollection = async (collectionId: string) => {
  try {
    return await db.getAllAsync('SELECT * FROM cards WHERE collectionId = ?;', collectionId);
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
};

/** Функция для получения папок по parentFolderId */
export const getFoldersByParentId = async (parentFolderId: string | null): Promise<Folder[]> => {
  try {
    return await db.getAllAsync(
      'SELECT * FROM folders WHERE parentFolderId IS ?;',
      parentFolderId
    );
  } catch (error) {
    console.error('Ошибка при получении папок:', error);
    return [];
  }
};

/** Находит папку по её ID */
export const getFolderById = async (id: string): Promise<Folder | null> => {
  try {
    const rows = await db.getAllAsync('SELECT * FROM folders WHERE id = ?;', id) as Folder[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Ошибка при получении папки по ID:', error);
    return null;
  }
};


/** Функция для добавления новой папки */
export const addFolder = async (name: string, parentFolderId: string | null = null, createdByUser: number = 1): Promise<string | null> => {
  const id = uuid.v4() as string;

  try {
    await db.runAsync(
      'INSERT INTO folders (id, name, parentFolderId, createdByUser) VALUES (?, ?, ?, ?);',
      id,
      name,
      parentFolderId,
      createdByUser
    );
    console.log('Папка добавлена');
    return id;
  } catch (error) {
    console.error('Ошибка при добавлении папки:', error);
    return null;
  }
};

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

/** Функция для переименования папки */
export const renameFolder = async (id: string, newName: string): Promise<void> => {
  try {
    await db.runAsync(
      'UPDATE folders SET name = ? WHERE id = ?;',
      newName,
      id
    );
    console.log('Папка переименована');
  } catch (error) {
    console.error('Ошибка при переименовании папки:', error);
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

/** Функция для удаления папки */
export const deleteFolder = async (id: string): Promise<void> => {
  try {
    // Удаляем все вложенные папки и коллекции рекурсивно
    await db.runAsync('DELETE FROM folders WHERE id = ?;', id);
    await db.runAsync('DELETE FROM collections WHERE folderId = ?;', id);

    // Получаем все вложенные папки
    const subfolders = await getFoldersByParentId(id);
    for (const folder of subfolders) {
      await deleteFolder(folder.id);
    }

    console.log('Папка удалена');
  } catch (error) {
    console.error('Ошибка при удалении папки:', error);
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

// Удаляет существующие таблицы
export const resetAppState = async () => {
  try {
    console.log('Начинается сброс состояния приложения...');
    await AsyncStorage.removeItem('dataLoaded'); // Удаляем флаг загрузки данных
    await initDatabase(); // Переинициализация базы данных
    console.log('Состояние приложения успешно сброшено.');
  } catch (error) {
    console.error('Ошибка при сбросе состояния приложения: ', error);
  }
};
