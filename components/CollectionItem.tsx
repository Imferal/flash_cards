import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Collection } from '@/data/types';
import { Card, Divider, IconButton, Switch, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface CollectionItemProps {
  collection: Collection;
  onToggleSelect: (collectionId: string) => void;
  onRename: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onMove: (collectionId: string) => void;
  onEdit: (folderId: string) => void;
}

export default function CollectionItem(
  {
    collection,
    onToggleSelect,
    onRename,
    onDelete,
    onMove,
    onEdit,
  }: CollectionItemProps) {
  const theme = useTheme(); // Получаем текущую тему

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={() => onEdit(collection.id)}>
        <Card.Title
          title={collection.name}
          titleStyle={styles.titleStyle}
          contentStyle={styles.contentStyle}
          leftStyle={styles.leftStyle}
          left={(props) => (
            <MaterialIcons
              name="layers"
              size={props.size * 0.8}
              color={theme.colors.primary}
            />
          )}
          right={(props) => (
            <Switch
              value={collection.selected === 1}
              onValueChange={() => onToggleSelect(collection.id)}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={[styles.divider, { backgroundColor: theme.colors.primary }]}/>

        <Card.Actions>
        {/* Кнопка "Переименовать" */}
        <IconButton
          mode="text"
          icon={(props) => (
            <MaterialIcons
              name="edit"
              size={props.size}
              color={props.color}
            />
          )}
          onPress={() => onRename(collection)}
        />
        {/* Кнопка "Перенести" */}
        <IconButton
          mode="text"
          icon={(props) => (
            <MaterialIcons
              name="drive-file-move"
              size={props.size}
              color={props.color}
            />
          )}
          onPress={() => onMove(collection.id)}
        />
        {/* Кнопка "Удалить" */}
        <IconButton
          mode="text"
          icon={(props) => (
            <MaterialIcons
              name="delete-forever"
              size={props.size}
              color={props.color}
            />
          )}
          onPress={() => onDelete(collection.id)}
        />
      </Card.Actions>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 8,
    padding: 8,
  },
  contentStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  divider: {
    opacity: 0.5,
    height: 2,
    marginLeft: '5%',
    width: '90%',
  },
  titleStyle: {
    fontSize: 18,
    marginLeft: 0,
    textAlignVertical: 'center',
  },
  leftStyle: {
    justifyContent: 'center',
    marginRight: 0,
  },
});
