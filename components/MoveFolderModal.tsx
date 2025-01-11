// components/MoveFolderModal.tsx

import React, { useEffect, useState } from 'react';
import { getAllDescendants, getFolders } from '@/data/database';
import { Folder } from '@/data/types';
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MoveFolderModalProps {
  visible: boolean;
  folderId: string | null;
  onClose: () => void;
  onConfirm: (targetFolderId: string | null) => void;
}

/**
 * Позволяет выбрать целевую папку для переноса folderId,
 * исключая сам folderId и всех её потомков.
 */
export default function MoveFolderModal(
  {
    visible,
    folderId,
    onClose,
    onConfirm,
  }: MoveFolderModalProps) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!visible || !folderId) return;
    (async () => {
      const all = await getFolders();
      const descendants = await getAllDescendants(folderId);
      descendants.push(folderId);
      const filtered = all.filter(f => !descendants.includes(f.id));
      setFolders(filtered);
    })();
  }, [visible, folderId]);

  const handleSelectFolder = async (id: string | null) => {
    onConfirm(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Выберите папку для переноса</Text>

          {/* Кнопка выбора корневой папки */}
          <TouchableOpacity style={styles.folderItem} onPress={() => handleSelectFolder(null)}>
            <Text style={styles.folderItemText}>[Корневая папка]</Text>
          </TouchableOpacity>

          <FlatList data={folders} keyExtractor={item => item.id} renderItem={({ item }) => (
            <TouchableOpacity style={styles.folderItem} onPress={() => handleSelectFolder(item.id)}>
              <Text style={styles.folderItemText}>📁 {item.name}</Text>
            </TouchableOpacity>
          )}
          />
          <Button title="Отмена" onPress={onClose}/>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  folderItem: {
    paddingVertical: 8,
  },
  folderItemText: {
    fontSize: 16,
  },
});