import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NetworkError({ navigation }) {
  return (
    <View style={styles.container}>
      <Ionicons name="wifi-outline" size={80} color="#ccc" />
      <Text style={styles.title}>No Connection</Text>
      <Text style={styles.desc}>Please check your internet settings to continue using Kisan Marg.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Splash')}>
        <Text style={styles.btnText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#112244', marginTop: 20 },
  desc: { textAlign: 'center', color: '#777', marginTop: 10, lineHeight: 20 },
  btn: { marginTop: 30, backgroundColor: '#6aaa49', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});