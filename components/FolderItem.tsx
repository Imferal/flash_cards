// components/FolderItem.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Folder } from '@/data/types';
import { Button, Card, Divider, IconButton, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface FolderItemProps {
  folder: Folder;
  onPress: (folderId: string) => void;
  onRename: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
  onMove: (collectionId: string) => void;
}

export default function FolderItem(
  {
    folder,
    onPress,
    onRename,
    onDelete,
    onMove,
  }: FolderItemProps) {
  const theme = useTheme();  // Получаем текущую тему

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Нажатие на название → перейти внутрь папки */}
      <TouchableOpacity onPress={() => onPress(folder.id)}>
        <Card.Title
          title={folder.name}
          titleStyle={styles.titleStyle} // Стили текста
          contentStyle={styles.contentStyle}
          leftStyle={styles.leftStyle} // Стили для блока с иконкой
          left={(props) => (
            <MaterialIcons
              name="folder-open"
              size={props.size * 0.8}
              color={theme.colors.primary}
            />
          )}
        />

        <Divider style={[styles.divider, { backgroundColor: theme.colors.primary }]}/>

        <Card.Actions>
          <Card.Actions>
            {/* Кнопка Переименовать */}
            <IconButton
              mode="text"
              icon={(props) => (
                <MaterialIcons
                  name="edit"
                  size={props.size}  // Использует стандартный размер
                  color={props.color}
                />
              )}
              onPress={() => onRename(folder)}
            />

            {/* Кнопка Перенести */}
            <IconButton
              mode="text"
              icon={(props) => (
                <MaterialIcons
                  name="drive-file-move"
                  size={props.size}  // Стандартный размер
                  color={props.color}
                />
              )}
              onPress={() => onMove(folder.id)}
            />

            {/* Кнопка Удалить */}
            <IconButton
              mode="text"
              icon={(props) => (
                <MaterialIcons
                  name="delete-forever"
                  size={props.size}
                  color={props.color}
                />
              )}
              onPress={() => onDelete(folder.id)}
            />
          </Card.Actions>
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

