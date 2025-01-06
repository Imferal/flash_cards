// app/(tabs)/folders/FolderContent.tsx

import React, { useContext, useEffect, useState } from 'react';
import { Button, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { CollectionsContext } from '@/contexts/CollectionsContext';
import { addFolder, getCollections, getFolderById, getFoldersByParentId, moveCollection } from '@/data/database';
import { Collection, Folder } from '@/data/types';
import { Ionicons } from '@expo/vector-icons';
import MoveCollectionModal from '@/components/MoveCollectionModal';

interface Props {
  folderId: string | null;
}

export default function FolderContent({ folderId }: Props) {
  const router = useRouter();

  // Состояния для папок, хлебных крошек и модалки "Добавить папку"
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Состояния для переноса коллекции
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [collectionToMove, setCollectionToMove] = useState<string | null>(null);

  // Подтягиваем коллекции из контекста
  const { collections, toggleCollection, reloadCollections } = useContext(CollectionsContext);

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

  // Переход в папку
  const handleFolderPress = (id: string) => {
    router.push(`/folders/${id}`);
  };

  // Переключение коллекции
  const handleToggleCollection = (collectionId: string) => {
    // Вызываем toggleCollection из контекста
    toggleCollection(collectionId);
  };

  // Хлебные крошки: нажатие
  const handleBreadcrumbPress = (id: string | null) => {
    router.push(`/folders/${id ?? ''}`);
  };

  // Перенести: нажатие
  const handleMovePress = (collectionId: string) => {
    console.log(`Открытие модального окна для переноса коллекции: ${collectionId}`);
    setMoveModalVisible(true);
    setCollectionToMove(collectionId);
  };

  // Коллекция успешно перенесена
  const handleConfirmMove = async (targetFolderId: string | null) => {
    console.log(`Подтверждён перенос коллекции ${collectionToMove} в папку ${targetFolderId}`);
    if (!collectionToMove) return;

    await moveCollection(collectionToMove, targetFolderId);

    // После переноса — перезагружаем коллекции из базы, чтобы обновить состояние интерфейса
    await reloadCollections();

    setMoveModalVisible(false);
    setCollectionToMove(null);
  };

  return (
    <View style={styles.container}>
      {/* Хлебные крошки */}
      <View style={styles.breadcrumbContainer}>
        <TouchableOpacity onPress={() => handleBreadcrumbPress(null)}>
          <Ionicons name="home-outline" size={20} color="#000000de" style={styles.icon}/>
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
                <View style={styles.collectionHeader}>
                  <Text style={styles.collectionItem}>📄 {coll.name}</Text>
                  <Switch
                    value={coll.selected === 1}
                    onValueChange={() => handleToggleCollection(coll.id)}
                  />
                </View>

                {/* Кнопка "Перенести" под названием коллекции */}
                <TouchableOpacity style={styles.moveButtonContainer} onPress={() => handleMovePress(coll.id)}>
                  <Text style={styles.moveButtonText}>Перенести</Text>
                </TouchableOpacity>
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
                <Button title="Добавить" onPress={handleAddFolder}/>
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Отмена" onPress={() => setModalVisible(false)}/>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <MoveCollectionModal
        visible={moveModalVisible}
        collectionId={collectionToMove}
        onClose={() => setMoveModalVisible(false)}
        onConfirm={handleConfirmMove}
      />
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
    marginVertical: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1, // Тень для Android
    shadowColor: '#000', // Тень для iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collectionItem: {
    fontSize: 18,
    flex: 1,
  },
  moveButtonContainer: {
    backgroundColor: '#e0f7fa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8, // Отступ сверху для кнопки
  },
  moveButtonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: '500',
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

