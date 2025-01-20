// app/(tabs)/folders/FolderContent.tsx

import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CollectionsContext } from '@/contexts/CollectionsContext';
import { Collection, Folder } from '@/data/types';
import { MaterialIcons } from '@expo/vector-icons';
import MoveCollectionModal from '@/components/MoveCollectionModal';
import FolderModal from '@/components/FolderModal';
import CollectionModal from '@/components/CollectionModal';
import FolderItem from '@/components/FolderItem';
import CollectionItem from '@/components/CollectionItem';
import MoveFolderModal from '@/components/MoveFolderModal';
import { FAB, Surface, useTheme } from 'react-native-paper';
import {
  addFolder,
  deleteFolder,
  getFolderById,
  getFoldersByParentId,
  moveFolder,
  renameFolder,
} from '@/data/folders.db.ts';
import { addCollection, deleteCollection, moveCollection, renameCollection } from '@/data/collections.db.ts';
import BreadCrumbs from '@/components/BreadCrumbs';
import ConfirmationModal from '@/components/ConfirmationModal';

interface Props {
  folderId: string | null;
}

export default function FolderContent({ folderId }: Props) {
  const theme = useTheme();
  const router = useRouter();

  // Состояния для папок, хлебных крошек и модалки "Добавить папку"
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [addFolderModalVisible, setAddFolderModalVisible] = useState(false);
  const [addCollectionModalVisible, setAddCollectionModalVisible] = useState(false);

  // Для удаления папки:
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  // Для удаления коллекции:
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  // Локальные стейты для “Переименовать папку”
  const [renameFolderModalVisible, setRenameFolderModalVisible] = useState(false);
  const [folderToRenameId, setFolderToRenameId] = useState<string | null>(null);
  const [folderToRenameName, setFolderToRenameName] = useState('');

  // Локальные стейты для “Переименовать коллекцию”
  const [renameCollectionModalVisible, setRenameCollectionModalVisible] = useState(false);
  const [collectionToRenameId, setCollectionToRenameId] = useState<string | null>(null);
  const [collectionToRenameName, setCollectionToRenameName] = useState('');

  // Состояния для переноса папки
  const [moveFolderModalVisible, setMoveFolderModalVisible] = useState(false);
  const [folderToMove, setFolderToMove] = useState<string | null>(null);

  // Состояния для переноса коллекции
  const [moveCollectionModalVisible, setMoveCollectionModalVisible] = useState(false);
  const [collectionToMove, setCollectionToMove] = useState<string | null>(null);

  // Подтягиваем коллекции из контекста
  const { collections, toggleCollection, reloadCollections } = useContext(CollectionsContext);

  // Фильтруем коллекции для текущей папки
  const folderCollections = collections.filter((col) => col.folderId === folderId);

  useEffect(() => {
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

  const loadFolders = async () => {
    const loadedFolders = await getFoldersByParentId(folderId);
    setFolders(loadedFolders);
  };

  // Добавляет новую папку
  const handleAddFolder = async (folderName: string) => {
    const newFolderId = await addFolder(folderName, folderId, 1);
    if (newFolderId) {
      await loadFolders();
    }
  };

  // Добавляет новую коллекцию
  const handleAddCollection = async (collectionName: string) => {
    const newCollectionId = await addCollection(collectionName, folderId, 1, true);
    if (newCollectionId) {
      await reloadCollections(); // обновляем списки
    }
  };

  // Переименовывает папку
  const handleRenameFolder = async (folderId: string, folderName: string) => {
    await renameFolder(folderId, folderName);
    await loadFolders();
  };

  // Переименовывает коллекцию
  const handleRenameCollection = async (collectionId: string, collectionName: string) => {
    await renameCollection(collectionId, collectionName);
    await reloadCollections();
  };

  // Переход в папку
  const handleFolderPress = (id: string) => {
    router.push(`/folders/${id}`);
  };

  // Переключение коллекции
  const handleToggleCollection = (collectionId: string, newValue: boolean) => {
    toggleCollection(collectionId, newValue);
  };

  // Перенести папку: нажатие
  const onMoveFolderPress = (folderId: string) => {
    setMoveFolderModalVisible(true);
    setFolderToMove(folderId);
  };

  // Перенести коллекцию: нажатие
  const onMoveCollectionPress = (collectionId: string) => {
    setMoveCollectionModalVisible(true);
    setCollectionToMove(collectionId);
  };

  const onEditCollectionPress = (collectionId: string) => {
    console.log('Нажата кнопка редактирования коллекции с Id: ', collectionId)
    router.push({
      pathname: `/collections/${collectionId}/CardsScreen`,
      params: { folderId },
    });
  }

  const onRenameFolderPress = (folder: Folder) => {
    // сохраняем ID и старое имя
    setFolderToRenameId(folder.id);
    setFolderToRenameName(folder.name);
    // показываем модалку
    setRenameFolderModalVisible(true);
  };

  const onRenameCollectionPress = (collection: Collection) => {
    // сохраняем ID и старое имя
    setCollectionToRenameId(collection.id);
    setCollectionToRenameName(collection.name);
    // показываем модалку
    setRenameCollectionModalVisible(true);
  };

  // Папка успешно перенесена
  const handleConfirmFolderMove = async (targetFolderId: string | null) => {
    console.log(`Подтверждён перенос папки ${folderToMove} в папку ${targetFolderId}`);
    if (!folderToMove) return;

    await moveFolder(folderToMove, targetFolderId);

    // После переноса — перезагружаем коллекции из базы, чтобы обновить состояние интерфейса
    await loadFolders();

    setMoveFolderModalVisible(false);
    setFolderToMove(null);
  };

  // Коллекция успешно перенесена
  const handleConfirmCollectionMove = async (targetFolderId: string | null) => {
    console.log(`Подтверждён перенос коллекции ${collectionToMove} в папку ${targetFolderId}`);
    if (!collectionToMove) return;

    await moveCollection(collectionToMove, targetFolderId);

    // После переноса — перезагружаем коллекции из базы, чтобы обновить состояние интерфейса
    await reloadCollections();

    setMoveCollectionModalVisible(false);
    setCollectionToMove(null);
  };


  // Нажато "Удалить" на папке
  const onDeleteFolderPress = (id: string) => {
    setFolderToDelete(id);
    setCollectionToDelete(null);
    setConfirmDeleteModalVisible(true);
  };

  // Нажато "Удалить" на коллекции
  const onDeleteCollectionPress = (id: string) => {
    setCollectionToDelete(id);
    setFolderToDelete(null);
    setConfirmDeleteModalVisible(true);
  };

  // Пользователь подтвердил удаление
  const handleConfirmDelete = async () => {
    if (folderToDelete) {
      await deleteFolder(folderToDelete);
      await loadFolders();
      setFolderToDelete(null);
    } else if (collectionToDelete) {
      await deleteCollection(collectionToDelete);
      await reloadCollections();
      setCollectionToDelete(null);
    }
    setConfirmDeleteModalVisible(false);
  };

  // Пользователь отменил удаление
  const handleCancelDelete = () => {
    setFolderToDelete(null);
    setCollectionToDelete(null);
    setConfirmDeleteModalVisible(false);
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Хлебные крошки */}
      <BreadCrumbs
        crumbs={breadcrumbs.map((folder) => ({
          id: folder.id,
          name: folder.name,
        }))}
      />

      <FlatList
        data={[...folders, ...folderCollections]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // Папка
          if ('parentFolderId' in item) {
            const folderItem = item as Folder;
            return (
              <FolderItem
                folder={folderItem}
                onPress={handleFolderPress}
                onRename={onRenameFolderPress}
                onDelete={(folderId) => onDeleteFolderPress(folderId)}
                onMove={onMoveFolderPress}
              />
            );
          } else {
            // Коллекция
            const coll = item as Collection;
            return (
              <CollectionItem
                collection={coll}
                onToggleSelect={handleToggleCollection}
                onRename={onRenameCollectionPress}
                onDelete={(collectionId) => onDeleteCollectionPress(collectionId)}
                onMove={onMoveCollectionPress}
                onEdit={onEditCollectionPress}
              />
            );
          }
        }}
      />

      {/* Добавить папку */}
      <FAB
        style={[styles.fab, styles.fabFolder, { backgroundColor: theme.colors.accent }]}
        icon={(props) => (
          <MaterialIcons name="create-new-folder" size={props.size} color={theme.colors.background} />
        )}
        onPress={() => setAddFolderModalVisible(true)}
      />

      {/* Добавить коллекцию */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
        icon={(props) => (
          <MaterialIcons name="library-add" size={props.size} color={theme.colors.background} />
        )}
        onPress={() => setAddCollectionModalVisible(true)}
      />

      {/* Модалка добавления папки */}
      <FolderModal
        visible={addFolderModalVisible}
        onClose={() => setAddFolderModalVisible(false)}
        onSubmit={handleAddFolder}
      />

      {/* Модалка добавления коллекции */}
      <CollectionModal
        visible={addCollectionModalVisible}
        onClose={() => setAddCollectionModalVisible(false)}
        onSubmit={handleAddCollection}
      />

      {/* Модалка переименования папки */}
      <FolderModal
        visible={renameFolderModalVisible}
        onClose={() => setRenameFolderModalVisible(false)}
        onSubmit={(newName) => {
          if (!folderToRenameId) return;
          handleRenameFolder(folderToRenameId, newName);
          setRenameFolderModalVisible(false);
        }}
        initialName={folderToRenameName}
        submitButtonLabel="Переименовать"
        title="Переименовать папку"
      />

      {/* Модалка переименования коллекции */}
      <CollectionModal
        visible={renameCollectionModalVisible}
        onClose={() => setRenameCollectionModalVisible(false)}
        onSubmit={(newName) => {
          if (!collectionToRenameId) return;
          handleRenameCollection(collectionToRenameId, newName);
          setRenameCollectionModalVisible(false);
        }}
        initialName={collectionToRenameName}
        submitButtonLabel="Переименовать"
        title="Переименовать коллекцию"
      />

      <MoveFolderModal
        visible={moveFolderModalVisible}
        folderId={folderToMove}
        onClose={() => setMoveFolderModalVisible(false)}
        onConfirm={handleConfirmFolderMove}
      />

      <MoveCollectionModal
        visible={moveCollectionModalVisible}
        collectionId={collectionToMove}
        onClose={() => setMoveCollectionModalVisible(false)}
        onConfirm={handleConfirmCollectionMove}
      />

      {/*Подтверждение удаления*/}
      <ConfirmationModal
        visible={confirmDeleteModalVisible}
        title="Подтвердите удаление"
        message="Это действие нельзя отменить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
  },
  charCounter: {
    textAlign: 'right',
    marginBottom: 32,
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
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
    paddingHorizontal: 4,
  },
  breadcrumbSeparator: {
    fontSize: 16,
  },
  breadcrumbCurrent: {
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // тень на Android
    shadowColor: '#000', // тень на iOS
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  fabFolder: {
    bottom: 80,
  },
  folderItem: {
    fontSize: 18,
    marginVertical: 8,
  },
  collectionRow: {
    marginVertical: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8, // Отступ сверху для кнопки
  },
  moveButtonText: {
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
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
