import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard: (frontText: string, backText: string) => void;
}

export default function AddCardModal({ visible, onClose, onAddCard }: AddCardModalProps) {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const handleAddCard = () => {
    if (frontText && backText) {
      onAddCard(frontText, backText);

      setFrontText('');
      setBackText('');

      onClose();
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Card</Text>

          {/* Поле для иностранного слова */}
          <TextInput
            style={styles.input}
            placeholder="Word"
            value={frontText}
            onChangeText={setFrontText}
          />

          {/* Поле для перевода */}
          <TextInput
            style={styles.input}
            placeholder="Translation"
            value={backText}
            onChangeText={setBackText}
          />

          {/* Кнопка добавления карточки */}
          <TouchableOpacity style={styles.submitButton} onPress={handleAddCard}>
            <Text style={styles.submitButtonText}>Add Card</Text>
          </TouchableOpacity>

          {/* Кнопка отмены */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.submitButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: 'lightGray',
    padding: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
