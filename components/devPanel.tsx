import React from 'react';
import { Button } from 'react-native';
import { resetAppState } from '@/data/database';

export default function DevPanel() {
  const handleResetDB = async () => {
    await resetAppState();
  };

  return (
    <Button title="Сбросить базу" onPress={handleResetDB} />
  );
}