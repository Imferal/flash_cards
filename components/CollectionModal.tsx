// components/CollectionModal.tsx

import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';

interface AddCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (collectionName: string) => void;
  initialName?: string; // С каким текстом открывать инпут
  submitButtonLabel?: string; // Текст на кнопке ("Добавить" или "Переименовать")
  title?: string;
}

export default function CollectionModal(
  {
    visible,
    onClose,
    onSubmit,
    initialName = '',
    submitButtonLabel = 'Добавить',
    title = 'Создать коллекцию',
  }: AddCollectionModalProps) {
  const theme = useTheme();
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    // Когда открываем модалку заново, сбрасываем стейт на initialName
    if (visible) {
      setCollectionName(initialName as string);
    }
  }, [visible, initialName]);

  const handleSubmit = () => {
    if (collectionName.trim() !== '') {
      onSubmit(collectionName);
      setCollectionName('');
      onClose();
    } else {
      alert('Пожалуйста, введите название коллекции');
    }
  };

  const handleCancel = () => {
    setCollectionName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalContainer}>
          <Surface style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>{title}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.outline,
                  color: theme.colors.onSurface,
                  backgroundColor: theme.colors.background
                },
              ]}
              maxLength={160}
              placeholder="Название коллекции"
              value={collectionName}
              onChangeText={setCollectionName}
              placeholderTextColor={theme.colors.outline}
            />
            <Text style={[styles.charCounter, { color: theme.colors.onSurfaceVariant }]}>
              {collectionName.length}/160
            </Text>
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonSpacing}>
                <Button mode="contained" onPress={handleSubmit} buttonColor={theme.colors.primary}>
                  {submitButtonLabel}
                </Button>
              </View>
              <View style={styles.buttonSpacing}>
                <Button mode="outlined" onPress={handleCancel} textColor={theme.colors.primary}>
                  Отмена
                </Button>
              </View>
            </View>
          </Surface>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  charCounter: {
    textAlign: 'right',
    marginBottom: 32,
    fontSize: 12,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonSpacing: {
    flex: 1,
  },
});