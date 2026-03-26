import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const K_DARK_BLUE = '#112244';
const K_GREEN = '#6aaa49';

export default function FarmerAlertNotificaion() {
  const notifications = [
    { 
      id: '1', 
      title: 'New Order Received!', 
      body: 'Amit Kumar wants to buy 500kg of Potatoes.', 
      time: '2 mins ago', 
      type: 'order' 
    },
    { 
      id: '2', 
      title: 'Price Alert', 
      body: 'Tomato prices in Bhubaneswar market went up by 10%.', 
      time: '1 hour ago', 
      type: 'price' 
    },
    { 
      id: '3', 
      title: 'System Update', 
      body: 'Kisan Marg version 2.0 is now live with new features.', 
      time: 'Yesterday', 
      type: 'system' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.notifCard}>
            <View style={[styles.iconCircle, { backgroundColor: item.type === 'order' ? '#e8f5e9' : '#e3f2fd' }]}>
              <Ionicons 
                name={item.type === 'order' ? "cart" : "notifications"} 
                size={22} 
                color={item.type === 'order' ? K_GREEN : K_DARK_BLUE} 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff',
    elevation: 2 
  },
  title: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  markRead: { fontSize: 13, color: K_GREEN, fontWeight: '600' },
  notifCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: K_GREEN
  },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifTitle: { fontSize: 15, fontWeight: 'bold', color: K_DARK_BLUE },
  notifBody: { fontSize: 13, color: '#666', marginTop: 3 },
  notifTime: { fontSize: 11, color: '#aaa', marginTop: 8 }
});