import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';

interface AddFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
  initialName?: string; // С каким текстом открывать инпут
  submitButtonLabel?: string; // Текст на кнопке ("Добавить" или "Переименовать")
  title?: string; // Заголовок модалки
}

export default function FolderModal({
                                      visible,
                                      onClose,
                                      onSubmit,
                                      initialName = '',
                                      submitButtonLabel = 'Добавить',
                                      title = 'Создать папку',
                                    }: AddFolderModalProps) {
  const theme = useTheme();
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
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
              maxLength={80}
              placeholder="Название папки"
              value={folderName}
              onChangeText={setFolderName}
              placeholderTextColor={theme.colors.outline}
            />
            <Text style={[styles.charCounter, { color: theme.colors.onSurfaceVariant }]}>
              {folderName.length}/80
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
