// components/CollectionModal.tsx

import React, { useEffect, useState } from 'react';
import { Button, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

interface AddCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (collectionName: string) => void;
  initialName?: string;                   // С каким текстом открывать инпут
  submitButtonLabel?: string;            // Текст на кнопке ("Добавить" или "Переименовать")
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
      {/* При клике вне области модалки — скрываем клавиатуру */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TextInput
              style={styles.input}
              maxLength={160}
              placeholder="Название коллекции"
              value={collectionName}
              onChangeText={setCollectionName}
            />
            <Text style={styles.charCounter}>
              {collectionName.length}/160
            </Text>
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonSpacing}>
                <Button title={submitButtonLabel as string} onPress={handleSubmit}/>
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Отмена" onPress={handleCancel}/>
              </View>
            </View>
          </View>
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
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  charCounter: {
    textAlign: 'right',
    marginBottom: 32,
    fontSize: 12,
    color: 'gray',
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
