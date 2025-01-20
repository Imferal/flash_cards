// components/CardModal.tsx

import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

interface CardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (front: string, back: string) => void;
  /** Начальный текст "лицевой" стороны */
  initialFront?: string;
  /** Начальный текст "обратной" стороны */
  initialBack?: string;
  /** Текст на кнопке (например, "Создать" или "Изменить") */
  submitButtonLabel?: string;
  /** Заголовок модалки (например, "Создать карточку" / "Изменить карточку") */
  title?: string;
}

export default function CardModal(
  {
    visible,
    onClose,
    onSubmit,
    initialFront = '',
    initialBack = '',
    submitButtonLabel = 'Создать',
    title = 'Создать карточку',
  }: CardModalProps
) {
  const theme = useTheme();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    if (visible) {
      setFront(initialFront);
      setBack(initialBack);
    }
  }, [visible, initialFront, initialBack]);

  const handleSubmit = () => {
    if (front.trim() === '' && back.trim() === '') {
      alert('Пожалуйста, заполните лицевую и обратную стороны карточки');
      return;
    }
    if (front.trim() === '') {
      alert('Пожалуйста, заполните лицевую сторону карточки');
      return;
    }
    if (back.trim() === '') {
      alert('Пожалуйста, заполните обратную сторону карточки');
      return;
    }

    onSubmit(front, back);
    setFront('');
    setBack('');
    onClose();
  };

  const handleCancel = () => {
    setFront('');
    setBack('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Закрываем клавиатуру при клике вне полей ввода */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalContainer}>
          <Surface style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              {title}
            </Text>

            {/* Лицевая сторона */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.outline,
                  color: theme.colors.onSurface,
                  backgroundColor: theme.colors.background,
                },
              ]}
              placeholder="Лицевая сторона"
              placeholderTextColor={theme.colors.outline}
              value={front}
              onChangeText={setFront}
              maxLength={300}
              multiline
            />
            <Text style={[styles.charCounter, { color: theme.colors.onSurfaceVariant }]}>
              {front.length}/300
            </Text>

            {/* Обратная сторона */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.colors.outline,
                  color: theme.colors.onSurface,
                  backgroundColor: theme.colors.background,
                },
              ]}
              placeholder="Обратная сторона"
              placeholderTextColor={theme.colors.outline}
              value={back}
              onChangeText={setBack}
              maxLength={300}
              multiline
            />
            <Text style={[styles.charCounter, { color: theme.colors.onSurfaceVariant }]}>
              {back.length}/300
            </Text>

            {/* Кнопки */}
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonSpacing}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  buttonColor={theme.colors.primary}
                >
                  {submitButtonLabel}
                </Button>
              </View>
              <View style={styles.buttonSpacing}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  textColor={theme.colors.primary}
                >
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
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    marginBottom: 16,
    fontSize: 12,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 16,
  },
  buttonSpacing: {
    flex: 1,
  },
});
