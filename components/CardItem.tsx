import type { Card as CardType } from '@/data/types';
import { Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

interface CardItemProps {
  card: CardType;
  onPress: (cardId: string) => void;
  onDelete: (cardId: string) => void;
}

export default function CardItem({ card, onPress, onDelete }: CardItemProps) {
  const theme = useTheme();

  // При нажатии на карточку
  const handleCardPress = () => {
    if (onPress) {
      onPress(card.id);
    } else {
      console.log('Clicked card: ', card.id);
    }
  };

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={handleCardPress}>
        <View style={styles.contentWrapper}>
          {/* Лицевая сторона */}
          <Text style={[styles.frontText, { color: theme.colors.onSurface }]}>{card.frontText}</Text>

          {/* Разделитель */}
          <Divider style={[styles.divider, { backgroundColor: theme.colors.primary }]} />

          {/* Обратная сторона */}
          <Text style={[styles.backText, { color: theme.colors.onSurface }]}>{card.backText}</Text>
        </View>
      </TouchableOpacity>

      {/* Действия */}
      <Card.Actions style={styles.actionsContainer}>
        <IconButton
          mode="text"
          icon={(props) => (
            <MaterialIcons
              name="delete-forever"
              size={props.size}
              color={props.color}
            />
          )}
          onPress={() => onDelete(card.id)}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
  },
  contentWrapper: {
    paddingHorizontal: 8,
  },
  frontText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  divider: {
    height: 2,
    opacity: 0.5,
    marginVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '400',
  },
  actionsContainer: {
    justifyContent: 'flex-end',
  },
});