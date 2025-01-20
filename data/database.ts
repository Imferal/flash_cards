// data/database.ts

import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

import foldersData from './folders.json';
import englishVerbsCollection from './collections/english_irregular_verbs.json';
import kazakhWordsCollection from './collections/kazakh_common_words.json';
import { Collection, Folder } from '@/data/types';
import uuid from 'react-native-uuid';

const foldersDataTyped: Folder[] = foldersData as Folder[];
const englishVerbsCollectionTyped: Collection = englishVerbsCollection as Collection;
const kazakhWordsCollectionTyped: Collection = kazakhWordsCollection as Collection;

export let db: SQLiteDatabase;

export const initDatabase = async () => {
  try {
    db = await openDatabaseAsync('flashcards.db.ts');

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
    await db.runAsync(
      'INSERT INTO folders (id, name, parentFolderId, createdByUser) VALUES (?, ?, ?, ?);',
      folder.id, folder.name, folder.parentFolderId, folder.createdByUser
    );
  }

  const collections = [englishVerbsCollectionTyped, kazakhWordsCollectionTyped];

  for (const collection of collections) {
    await db.runAsync(
      'INSERT INTO collections (id, name, folderId, createdByUser, selected) VALUES (?, ?, ?, ?, ?);',
      collection.id, collection.name, collection.folderId, collection.createdByUser, collection.selected
    );

    for (const card of collection.cards) {
      const id = uuid.v4() as string;

      await db.runAsync(
        'INSERT INTO cards (id, frontText, backText, collectionId, createdByUser) VALUES (?, ?, ?, ?, ?);',
        id, card.frontText, card.backText, collection.id, collection.createdByUser
      );
    }
  }

  await AsyncStorage.setItem('dataLoaded', 'true');
};

// "Сбрасывает" состояние БД
export const resetAppState = async () => {
  try {
    console.log('Начинается сброс состояния приложения...');

    // Удаляем существующие таблицы:
    await db.execAsync(`
      DROP TABLE IF EXISTS folders;
      DROP TABLE IF EXISTS collections;
      DROP TABLE IF EXISTS cards;
    `);

    // Удаляем флаг загрузки данных
    await AsyncStorage.removeItem('dataLoaded');

    // Заново инициализируем БД (пересоздаём таблицы и вставляем папки/коллекции/карточки)
    await initDatabase();

    console.log('Состояние приложения успешно сброшено.');
  } catch (error) {
    console.error('Ошибка при сбросе состояния приложения: ', error);
  }
};
