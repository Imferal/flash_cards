import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';
import { CollectionsContext } from '@/contexts/CollectionsContext';

export default function CollectionsScreen() {
  const { collections, toggleCollection } = useContext(CollectionsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите коллекции для изучения:</Text>
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.collectionItem}>
            <Text style={styles.collectionName}>{item.name}</Text>
            <Switch
              value={item.selected === 1}
              onValueChange={() => toggleCollection(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  collectionName: {
    fontSize: 18,
  },
});