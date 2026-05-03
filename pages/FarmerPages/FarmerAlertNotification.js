import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../services/api'; 
import moment from 'moment';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerAlertNotification({ navigation }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // --- LIVE DATA FETCHING ---
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [activeTab])
  );

  const fetchData = async () => {
    try {
      if (activeTab === 'notifications') {
        // Fetch personal activity (New Orders, Payment Status)
        const response = await apiClient.get('/notifications');
        if (response.data.success) {
          setNotifications(response.data.data);
        }
      } else {
        // Fetch public admin alerts for Farmers
        const response = await apiClient.get('/alerts?type=Farmer');
        if (response.data.success) {
          setAlerts(response.data.data);
        }
      }
    } catch (error) {
      console.log("Fetch Error:", error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      // Update local state for immediate visual feedback
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.log("Mark Read Error:", err);
    }
  };

  // --- RENDER ACTIVITY (Personal Notifications) ---
  const renderNotification = ({ item }) => (
    <TouchableOpacity 
        style={[styles.notifCard, !item.isRead && styles.unreadNotif]} 
        onPress={() => {
            markAsRead(item._id);
            // Navigate to Orders if it's a new order notification
            if (item.type === 'NewOrder') navigation.navigate('Orders');
        }}
        activeOpacity={0.7}
    >
      <View style={[styles.notifIconCircle, { backgroundColor: item.isRead ? '#f0f0f0' : K_GREEN + '20' }]}>
        <Ionicons 
            name={item.type === 'NewOrder' ? 'leaf' : item.type === 'AdminAlert' ? 'megaphone' : 'wallet-outline'} 
            size={20} 
            color={item.isRead ? '#aaa' : K_GREEN} 
        />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !item.isRead && { fontWeight: 'bold', color: K_DARK_BLUE }]}>
            {item.title}
          </Text>
          <Text style={styles.notifTime}>{moment(item.createdAt).fromNow()}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.message}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  // --- RENDER NEWS & OFFERS (Admin Alerts) ---
  const renderAlert = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.alertImg} />
        ) : (
          <View style={[styles.alertImg, styles.placeholderImg]}>
             <Ionicons name="newspaper-outline" size={50} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.alertTextContent}>
        <View style={styles.alertHeaderRow}>
            <Text style={styles.alertTitle} numberOfLines={1}>{item.heading}</Text>
            <Text style={styles.alertTime}>{moment(item.createdAt).fromNow()}</Text>
        </View>
        <Text style={styles.alertDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agri Updates</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]} 
            onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'alerts' && styles.activeTab]} 
            onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>News & Offers</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}><ActivityIndicator size="large" color={K_GREEN} /></View>
      ) : (
        <FlatList
          data={activeTab === 'notifications' ? notifications : alerts}
          renderItem={activeTab === 'notifications' ? renderNotification : renderAlert}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={K_GREEN} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#eee" />
                <Text style={styles.emptyText}>No recent {activeTab} for you</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: K_DARK_BLUE },

  // Notification Card
  notifCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#fcfcfc' },
  unreadNotif: { backgroundColor: '#fafff9', borderRadius: 15, paddingHorizontal: 10, marginHorizontal: -10 },
  notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1, marginLeft: 15 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  notifTitle: { fontSize: 15, color: '#444' },
  notifTime: { fontSize: 11, color: '#aaa' },
  notifBody: { fontSize: 13, color: '#777', lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: K_GREEN, marginLeft: 10 },

  // Alert Card
  alertCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 25, elevation: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  alertImageContainer: { height: 180 }, 
  alertImg: { width: '100%', height: '100%' },
  placeholderImg: { backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center' },
  alertTextContent: { padding: 18 }, 
  alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertTitle: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE, flex: 1, marginRight: 10 },
  alertTime: { fontSize: 11, color: '#aaa' },
  alertDesc: { fontSize: 14, color: '#666', lineHeight: 20 },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', marginTop: 15, color: '#ccc', fontSize: 16 }
});