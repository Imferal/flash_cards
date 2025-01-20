import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Collection } from '@/data/types';
import { Card, Divider, IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface CollectionItemProps {
  collection: Collection;
  onToggleSelect: (collectionId: string, newValue: boolean) => void;
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
        <Card.Title
          title={collection.name}
          titleNumberOfLines={0}
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
          right={() => (
            <Switch
              value={collection.selected}
              onValueChange={(newValue) => onToggleSelect(collection.id, newValue)}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={[styles.divider, { backgroundColor: theme.colors.primary }]}/>

        <Card.Actions style={styles.actionsContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => onEdit(collection.id)}>
              <Text style={styles.editLink}>Редактировать</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRight}>
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
          </View>
        </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  buttonsRight: {
    flexDirection: 'row',
  },
  container: {
    marginHorizontal: 2,
    marginVertical: 8,
    padding: 8,
  },
  contentStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  divider: {
    opacity: 0.5,
    height: 2,
    marginLeft: '5%',
    width: '90%',
  },
  editLink: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  leftStyle: {
    justifyContent: 'center',
    marginRight: 0,
  },
  titleStyle: {
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 0,
    textAlignVertical: 'center',
    flexWrap: 'wrap',
  },
});
