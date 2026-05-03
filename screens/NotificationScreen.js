import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/api';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.log("Fetch Notif Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      // Update local state to show it's read immediately
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.log("Mark Read Error:", err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, !item.isRead && styles.unreadCard]} 
      onPress={() => markAsRead(item._id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.isRead ? '#eee' : K_GREEN + '20' }]}>
        <Ionicons 
          name={item.type === 'AdminAlert' ? 'megaphone' : 'cart'} 
          size={20} 
          color={item.isRead ? '#aaa' : K_GREEN} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, !item.isRead && styles.boldText]}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={K_GREEN} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="mail-open-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Your inbox is empty</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  listContent: { padding: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 1, alignItems: 'center' },
  unreadCard: { backgroundColor: '#f0f9eb', elevation: 3 },
  iconCircle: { width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, color: '#444' },
  boldText: { fontWeight: 'bold', color: K_DARK_BLUE },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: K_GREEN },
  message: { fontSize: 13, color: '#777', marginTop: 4, lineHeight: 18 },
  time: { fontSize: 10, color: '#bbb', marginTop: 8 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#aaa', marginTop: 10, fontSize: 14 }
});