// components/MoveCollectionModal.tsx

import { useEffect, useState } from 'react';
import { Folder } from '@/data/types.ts';
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFolders } from '@/data/folders.db.ts';

interface MoveCollectionModalProps {
  visible: boolean;
  collectionId: string | null;
  onClose: () => void;
  onConfirm: (folderId: string | null) => void;
}

export default function MoveCollectionModal(
  {
    visible,
    onClose,
    onConfirm,
  }: MoveCollectionModalProps) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const loadFolders = async (): Promise<Folder[]> => {
      try {
        const allFolders = await getFolders();
        setFolders(allFolders);
      } catch (error) {
        console.error(error);
      }
    };

    if (visible) {
      loadFolders();
    }
  }, [visible]);

  const handleSelectFolder = (folderId: string | null) => {
    onConfirm(folderId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Выберите папку для переноса</Text>

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