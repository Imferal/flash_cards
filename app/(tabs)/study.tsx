import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card';
import { getSelectedCollections, getCardsByCollection } from '@/data/database';

export default function StudyScreen() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      const selectedCollections = await getSelectedCollections();
      let allCards = [];
      for (const collection of selectedCollections) {
        const collectionCards = await getCardsByCollection(collection.id);
        allCards = allCards.concat(collectionCards);
      }
      setCards(allCards);
      setCurrentCardIndex(allCards.length > 0 ? 0 : null);
    };
    loadCards().catch(console.error);
  }, []);

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
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.header}>Cards</Text>

      {/* Карточка */}
      <View style={styles.cardContainer}>
        {currentCardIndex !== null && cards.length > 0 && (
          <Card
            word={cards[currentCardIndex].word}
            translation={cards[currentCardIndex].translation}
            isFlipped={isFlipped}
            onPress={handleCardPress}
            isAnimating={isAnimating}
            onAnimationEnd={handleAnimationEnd}
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