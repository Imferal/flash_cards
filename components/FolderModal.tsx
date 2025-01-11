// components/FolderModal.tsx

import React, { useEffect, useState } from 'react';
import { Button, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

interface AddFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
  initialName?: string; // С каким текстом открывать инпут
  submitButtonLabel?: string; // Текст на кнопке ("Добавить" или "Переименовать")
}

export default function FolderModal(
  {
    visible,
    onClose,
    onSubmit,
    initialName = '',
    submitButtonLabel = 'Добавить',
    title = 'Создать папку',
  }: AddFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    // Когда открываем модалку заново, сбрасываем стейт на initialName
    if (visible) {
      setFolderName(initialName as string);
    }
  }, [visible, initialName]);

  const handleSubmit = () => {
    if (folderName.trim() !== '') {
      onSubmit(folderName);
      setFolderName('');
      onClose();
    } else {
      alert('Пожалуйста, введите название папки');
    }
  };

  const handleCancel = () => {
    setFolderName('');
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
              maxLength={80}
              placeholder="Название папки"
              value={folderName}
              onChangeText={setFolderName}
            />
            <Text style={styles.charCounter}>
              {folderName.length}/80
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
