import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const B_ORANGE = '#FF5733';

export default function BuyerHome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kisan Marg Market</Text>
        <Text style={styles.subtitle}>Find fresh produce near you</Text>
        
        <View style={styles.placeholderCard}>
          <Text style={styles.cardText}>Market listings coming soon...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: B_ORANGE },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  placeholderCard: {
    width: '100%',
    padding: 40,
    backgroundColor: '#fff7f5',
    borderRadius: 15,
    marginTop: 30,
    borderWidth: 1,
    borderColor: B_ORANGE,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  cardText: { color: B_ORANGE, fontWeight: '500' },
});