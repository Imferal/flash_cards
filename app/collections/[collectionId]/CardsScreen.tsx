// app/collections/[collectionId]/CardsScreen.tsx

import { FAB, Searchbar, Surface, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { deleteCard, getCardsByCollection } from '@/data/cards.db.ts';
import { FlatList, StyleSheet } from 'react-native';
// import CardModal from '@/components/CardModal';
import CardItem from '@/components/CardItem';
import BreadCrumbs from '@/components/BreadCrumbs';
import { Folder } from '@/data/types.ts';
import { getFolderById } from '@/data/folders.db.ts';
import { MaterialIcons } from '@expo/vector-icons';


export default function CardsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { collectionId, folderId } = useLocalSearchParams<{ collectionId: string; folderId: string | null }>();

  const [cards, setCards] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);

  // const [addModalVisible, setAddModalVisible] = useState(false);

  // Загружаем карточки
  useEffect(() => {
    if (!collectionId) return;
    getCardsByCollection(collectionId)
      .then(rows => setCards(rows))
      .catch(console.error);

    loadBreadcrumbs(folderId).catch(console.error); // Загружаем крошки

  }, [collectionId]);

  // Загружаем хлебные крошки
  const loadBreadcrumbs = async (currentFolderId: string | null) => {
    const path: Folder[] = [];
    while (currentFolderId) {
      const currentFolder = await getFolderById(currentFolderId); // Получаем папку по ID
      if (!currentFolder) break;
      path.unshift(currentFolder); // Добавляем в начало массива
      currentFolderId = currentFolder.parentFolderId; // Переходим к родительской папке
    }
    setBreadcrumbs(path);
  };

  // Фильтрация по полям
  const filteredCards = cards.filter(card => {
    const searchString = searchText.toLowerCase();
    return (
      card.frontText?.toLowerCase().includes(searchString) ||
      card.backText?.toLowerCase().includes(searchString)
    );
  });

  const handleCardPress = (cardId: string) => {
    console.log('Clicked on card: ', cardId);
  };

  const onCardClose = () => {
    console.log('Карточка закрыта');
  };

  const onCardEdit = () => {
    console.log('Карточка изменена');
  };

  const onCardDelete = async (cardId: string) => {
    await deleteCard(cardId); // Удаляем карточку
    await refreshCards(); // Обновляем список
  };

  const refreshCards = async () => {
    if (!collectionId) return;
    const updatedCards = await getCardsByCollection(collectionId);
    setCards(updatedCards);
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Хлебные крошки */}
      <BreadCrumbs
        crumbs={breadcrumbs.map((folder) => ({
          id: folder.id,
          name: folder.name,
        }))}
        isLastElementClickable={true}
      />

      {/* Поле поиска */}
      <Searchbar
        placeholder="Поиск..."
        value={searchText}
        onChangeText={setSearchText}
        style={[styles.searchbar, {backgroundColor: theme.colors.surface}]}
      />

      {/* Список карточек */}
      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <CardItem
              card={item}
              onPress={handleCardPress}
              onDelete={onCardDelete}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB-кнопка (например, для добавления) */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
        icon={(props) => (
          <MaterialIcons name="add" size={props.size} color={theme.colors.background} />
        )}
        onPress={() => {
          console.log('Add card pressed');
          // setAddModalVisible(true);
        }}
      />

      {/* Пример (закомментировано), если у вас уже есть CardModal */}
      {/*
      <CardModal
         visible={addModalVisible}
         onClose={() => setAddModalVisible(false)}
         onSubmit={(front, back) => {
           // Здесь вы вызываете addCard(front, back, collectionId)
           // И обновляете setCards([...cards, { ... }])
         }}
      />
      */}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
  },
  searchbar: {
    margin: 8,
  },
  listContent: {
    paddingBottom: 64,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});