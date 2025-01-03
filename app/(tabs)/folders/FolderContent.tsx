// app/(tabs)/folders/FolderContent.tsx

import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Switch } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { CollectionsContext } from '@/contexts/CollectionsContext';
import { addFolder, getFolderById, getFoldersByParentId } from '@/data/database';
import { Folder, Collection } from '@/data/types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  folderId: string | null;
}

export default function FolderContent({ folderId }: Props) {
  const router = useRouter();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Подтягиваем коллекции из контекста
  const { collections, toggleCollection } = useContext(CollectionsContext);

  // Фильтруем коллекции для текущей папки
  const folderCollections = collections.filter((col) => col.folderId === folderId);

  useEffect(() => {
    const loadFolders = async () => {
      const loadedFolders = await getFoldersByParentId(folderId);
      setFolders(loadedFolders);
    };
    loadFolders().catch(console.error);

    // Загружаем хлебные крошки
    const loadBreadcrumbs = async () => {
      let currentFolderId = folderId;
      const path: Folder[] = [];

      while (currentFolderId) {
        const currentFolder = await getFolderById(currentFolderId); // Получаем папку по ID
        if (!currentFolder) break;
        path.unshift(currentFolder); // Добавляем в начало массива
        currentFolderId = currentFolder.parentFolderId; // Переходим к родительской папке
      }

      setBreadcrumbs(path);
    };
    loadBreadcrumbs().catch(console.error);
  }, [folderId]);

  const handleAddFolder = async () => {
    if (newFolderName.trim() !== '') {
      const newFolderId = await addFolder(newFolderName, folderId, 1);
      if (newFolderId) {
        setFolders((prev) => [
          ...prev,
          {
            id: newFolderId,
            name: newFolderName,
            parentFolderId: folderId,
            createdByUser: 1,
          },
        ]);
        setNewFolderName('');
        setModalVisible(false);
      }
    } else {
      alert('Пожалуйста, введите название папки');
    }
  };

  const handleFolderPress = (id: string) => {
    router.push(`/folders/${id}`);
  };

  const handleToggleCollection = (collectionId: string) => {
    // Вызываем toggleCollection из контекста
    toggleCollection(collectionId);
  };

  const handleBreadcrumbPress = (id: string | null) => {
    router.push(`/folders/${id ?? ''}`);
  };

  return (
    <View style={styles.container}>
      {/* Хлебные крошки */}
      <View style={styles.breadcrumbContainer}>
        <TouchableOpacity onPress={() => handleBreadcrumbPress(null)}>
          <Ionicons name="home-outline" size={20} color="#000000de" style={styles.icon} />
        </TouchableOpacity>
        {breadcrumbs.map((folder, index) => (
          <View key={folder.id} style={styles.breadcrumbWrapper}>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            {index === breadcrumbs.length - 1 ? (
              <Text style={styles.breadcrumbCurrent}>{folder.name}</Text>
            ) : (
              <Link href={`/folders/${folder.id}`} style={styles.breadcrumbItem}>
                {folder.name}
              </Link>
            )}
          </View>
        ))}
      </View>

      <FlatList
        data={[...folders, ...folderCollections]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if ('parentFolderId' in item) {
            // Это папка
            const folderItem = item as Folder;
            return (
              <TouchableOpacity onPress={() => handleFolderPress(folderItem.id)}>
                <Text style={styles.folderItem}>📁 {folderItem.name}</Text>
              </TouchableOpacity>
            );
          } else {
            // Это коллекция
            const coll = item as Collection;
            return (
              <View style={styles.collectionRow}>
                <Text style={styles.collectionItem}>📄 {coll.name}</Text>
                <Switch
                  value={coll.selected === 1}
                  onValueChange={() => handleToggleCollection(coll.id)}
                />
              </View>
            );
          }
        }}
      />

      {/* Кнопка добавления папки */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Добавить папку</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новая папка</Text>
            <TextInput
              style={styles.input}
              maxLength={80}
              placeholder="Название папки"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <Text style={styles.charCounter}>
              {newFolderName.length}/80
            </Text>
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonSpacing}>
                <Button title="Добавить" onPress={handleAddFolder} />
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Отмена" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  charCounter: {
    textAlign: 'right',
    marginBottom: 32,
    fontSize: 12,
    color: 'gray',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonSpacing: {
    flex: 1,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  breadcrumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbItem: {
    fontSize: 16,
    fontWeight: '300',
    color: '#00000099',
    paddingHorizontal: 4,
  },
  breadcrumbSeparator: {
    fontSize: 16,
    color: '#00000099',
  },
  breadcrumbCurrent: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000de',
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  folderItem: {
    fontSize: 18,
    marginVertical: 8,
  },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  collectionItem: {
    fontSize: 18,
    width: '87%',
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

