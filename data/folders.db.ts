// data/folders.db.ts

import { db } from './database';
import uuid from 'react-native-uuid';
import { Folder } from '@/data/types';

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

export const getFolders = async (): Promise<Folder[]> => {
  try {
    return await db.getAllAsync('SELECT * FROM folders;');
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
}

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

export const moveFolder = async (folderId: string, newFolderId: string | null) => {
  try {
    await db.runAsync('UPDATE folders SET parentFolderId = ? WHERE id = ?;', newFolderId, folderId);
    console.log('Folder moved');
  } catch (error) {
    console.error('Error moving folder:', error)
  }
}

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


