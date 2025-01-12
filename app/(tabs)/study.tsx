// app/(tabs)/study.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@/components/Card';
import { CollectionsContext } from '@/contexts/CollectionsContext';
import { getCardsByCollection } from '@/data/cards.db.ts';
import { useTheme } from 'react-native-paper';

export default function StudyScreen() {
  const theme = useTheme();
  const { collections } = useContext(CollectionsContext);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      // Получаем выбранные коллекции
      const selectedCollections = collections.filter((col) => col.selected === 1);

      let allCards: any[] = [];
      for (const collection of selectedCollections) {
        const collectionCards = await getCardsByCollection(collection.id);
        allCards = allCards.concat(collectionCards);
      }

      setCards(allCards);
      setCurrentCardIndex(allCards.length > 0 ? 0 : null);
      setIsFlipped(false);
      setIsAnimating(false);
    };
    loadCards().catch(console.error);
  }, [collections]);

  // Функция для переворота карточки
  const handleCardPress = () => {
    if (isAnimating) return;

    if (!isFlipped) {
      // Если карточка не перевёрнута, переворачиваем её
      setIsFlipped(true);
    } else {
      // Если карточка перевёрнута, запускаем анимацию "улёта"
      setIsAnimating(true);
    }
  };

  // Функция, вызываемая после завершения анимации "улёта"
  const handleAnimationEnd = () => {
    // Выбираем новую случайную карточку
    if (cards.length > 0) {
      const newIndex = Math.floor(Math.random() * cards.length);
      setCurrentCardIndex(newIndex);
      setIsFlipped(false);
      setIsAnimating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Карточка */}
      <View style={styles.cardContainer}>
        {currentCardIndex !== null && cards.length > 0 && (
          <Card
            frontText={cards[currentCardIndex].frontText}
            backText={cards[currentCardIndex].backText}
            isFlipped={isFlipped}
            onPress={handleCardPress}
            isAnimating={isAnimating}
            onAnimationEnd={handleAnimationEnd}
            themeColors={{
              frontBackground: theme.colors.primaryContainer,
              backBackground: theme.colors.secondaryContainer,
              textColor: theme.colors.onSurface,
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
