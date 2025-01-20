// app/collections/[collectionId]/CardsScreen.tsx

import { FAB, Searchbar, Surface, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { addCard, deleteCard, getCardsByCollection, updateCard } from '@/data/cards.db.ts';
import { FlatList, StyleSheet } from 'react-native';
import CardItem from '@/components/CardItem';
import BreadCrumbs from '@/components/BreadCrumbs';
import { Folder } from '@/data/types.ts';
import { getFolderById } from '@/data/folders.db.ts';
import { MaterialIcons } from '@expo/vector-icons';
import CardModal from '@/components/CardModal';
import type {Card as CardType} from '@/data/types';


export default function CardsScreen() {
  const theme = useTheme();
  const { collectionId, folderId } = useLocalSearchParams<{ collectionId: string; folderId: string | null }>();

  const [cards, setCards] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [existingCard, setExiscitngCard] = useState<CardType>(null);

  const [AddCardModalVisible, setAddCardModalVisible] = useState(false);
  const [UpdateCardModalVisible, setUpdateCardModalVisible] = useState(false);

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

  const handleCardPress = (item: CardType) => {
    setExiscitngCard(item);
    setUpdateCardModalVisible(true);
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

  const onAddCard = async (front, back, collectionId) => {
    addCard(front, back, collectionId);
    refreshCards();
  }

  const onUpdateCard = async (front, back, collectionId) => {
    updateCard(front, back, collectionId);
    refreshCards();
  }

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
              onPress={() => handleCardPress(item)}
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
        onPress={() => setAddCardModalVisible(true)}
      />

      <CardModal
        visible={AddCardModalVisible}
        onClose={() => setAddCardModalVisible(false)}
        title="Создать карточку"
        submitButtonLabel="Создать"
        onSubmit={(front, back) => {
         onAddCard(front, back, collectionId);
        }}
      />

      <CardModal
        visible={UpdateCardModalVisible}
        onClose={() => setUpdateCardModalVisible(false)}
        title="Изменить карточку"
        submitButtonLabel="Изменить"
        initialFront={existingCard?.frontText ?? ''}
        initialBack={existingCard?.backText ?? ''}
        onSubmit={(front, back) => {
          onUpdateCard(existingCard.id, front, back);
        }}
      />

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