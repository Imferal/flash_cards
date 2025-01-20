// components/ConfirmationModal.tsx

import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

interface ConfirmationModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string; // Текст на кнопке удаления
  cancelLabel?: string; // Текст на кнопке "Отмена"
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal(
  {
    visible,
    title = 'Подтверждение',
    message = 'Вы уверены?',
    confirmLabel = 'Удалить',
    cancelLabel = 'Отмена',
    onConfirm,
    onCancel,
  }: ConfirmationModalProps,
) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Surface style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
            {message}
          </Text>

          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onPrimary}
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
            <Button
              mode="outlined"
              textColor={theme.colors.primary}
              onPress={onCancel}
            >
              {cancelLabel}
            </Button>
          </View>
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
