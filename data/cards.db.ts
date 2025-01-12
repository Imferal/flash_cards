// data/cards.db.ts

import { db } from './database';
import uuid from 'react-native-uuid';

export async function addCard(frontText: string, backText: string, collectionId: string, createdByUser = 1): Promise<string | null> {
  const id = uuid.v4() as string;
  try {
    await db.runAsync(
      'INSERT INTO cards (id, frontText, backText, collectionId, createdByUser) VALUES (?, ?, ?, ?, ?);',
      id, frontText, backText, collectionId, createdByUser
    );
    return id;
  } catch (error) {
    console.error('Error adding card:', error);
    return null;
  }
}

export async function updateCard(id: string, frontText: string, backText: string) {
  try {
    await db.runAsync(
      'UPDATE cards SET frontText = ?, backText = ? WHERE id = ?;',
      frontText,
      backText,
      id
    );
  } catch (error) {
    console.error('Error updating card:', error);
  }
}

export async function deleteCard(id: string) {
  try {
    await db.runAsync('DELETE FROM cards WHERE id = ?;', id);
  } catch (error) {
    console.error('Error deleting card:', error);
  }
}

export const getCardsByCollection = async (collectionId: string) => {
  try {
    return await db.getAllAsync('SELECT * FROM cards WHERE collectionId = ?;', collectionId);
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
};
