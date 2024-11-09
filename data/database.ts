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
        createdByUser INTEGER
      );
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        folderId TEXT,
        createdByUser INTEGER,
        selected INTEGER DEFAULT 0
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

    console.log('Database initialized');

    await loadInitialData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const loadInitialData = async () => {
  const isDataLoaded = await AsyncStorage.getItem('dataLoaded');
  if (isDataLoaded) {
    return;
  }

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
    // console.log('Card added');
  } catch (error) {
    console.error('Error adding card:', error);
  }
};

export const getCollections = async () => {
  try {
    const rows = await db.getAllAsync('SELECT * FROM collections;');
    return rows;
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};

export const toggleCollectionSelection = async (collectionId: string, selected: boolean) => {
  try {
    await db.runAsync(
      'UPDATE collections SET selected = ? WHERE id = ?;',
      selected ? 1 : 0, collectionId
    );
    console.log('Collection selection status updated');
  } catch (error) {
    console.error('Error updating collection selection status:', error);
  }
};

export const getSelectedCollections = async () => {
  try {
    const rows = await db.getAllAsync('SELECT * FROM collections WHERE selected = 1;');
    return rows;
  } catch (error) {
    console.error('Error getting selected collections:', error);
    return [];
  }
};

export const getCardsByCollection = async (collectionId: string) => {
  try {
    const rows = await db.getAllAsync('SELECT * FROM cards WHERE collectionId = ?;', collectionId);
    return rows;
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
};
