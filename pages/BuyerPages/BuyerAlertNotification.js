import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerAlertNotification({ navigation }) {
  const [activeTab, setActiveTab] = useState('notifications');

  // MOCK DATA: Notifications (Personal/Order related)
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Order Shipped 🚚', body: 'Your order #KM-8821 for Organic Potatoes has been shipped.', time: '10m ago', type: 'order', read: false },
    { id: '2', title: 'Payment Successful ✅', body: 'Payment of ₹450 received for your latest purchase.', time: '2h ago', type: 'payment', read: true },
    { id: '3', title: 'Back in Stock! 🌿', body: 'Red Onions from Patanjal Farms are now available.', time: 'Yesterday', type: 'stock', read: true },
  ]);

  // MOCK DATA: Alerts (Admin/Global news)
  const [alerts, setAlerts] = useState([
    { 
      id: 'a1', 
      title: 'Monsoon Offer: 20% OFF!', 
      desc: 'Get flat discounts on all green vegetables this week.', 
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 
      time: '1h ago' 
    },
    { 
      id: 'a2', 
      title: 'New App Version Available', 
      desc: 'Update to v1.0.5 for smoother payment tracking.', 
      img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', 
      time: '5h ago' 
    },
  ]);

  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const removeNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // --- RENDER NOTIFICATION (Google Message Style) ---
  const renderNotification = ({ item }) => (
    <TouchableOpacity 
        style={[styles.notifCard, !item.read && styles.unreadNotif]} 
        onPress={() => navigation.navigate('OrderDetails', { order: { id: '8821' } })}
    >
      <View style={[styles.notifIconCircle, { backgroundColor: item.read ? '#f0f0f0' : K_GREEN + '20' }]}>
        <Ionicons 
            name={item.type === 'order' ? 'cart' : item.type === 'payment' ? 'card' : 'notifications'} 
            size={20} 
            color={item.read ? '#aaa' : K_GREEN} 
        />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !item.read && { fontWeight: 'bold' }]}>{item.title}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={1}>{item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- RENDER ALERT (Big Image Card 80/20) ---
  const renderAlert = ({ item }) => (
    <TouchableOpacity style={styles.alertCard} activeOpacity={0.9}>
      <View style={styles.alertImageContainer}>
        <Image source={{ uri: item.img }} style={styles.alertImg} />
        <TouchableOpacity style={styles.alertCloseBtn} onPress={() => removeAlert(item.id)}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.alertTextContent}>
        <View style={styles.alertHeaderRow}>
            <Text style={styles.alertTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.alertTime}>{item.time}</Text>
        </View>
        <Text style={styles.alertDesc} numberOfLines={1}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Updates & Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* --- TABS --- */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]} 
            onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'alerts' && styles.activeTab]} 
            onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>Alerts</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'notifications' ? notifications : alerts}
        renderItem={activeTab === 'notifications' ? renderNotification : renderAlert}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nothing to show here</Text>}
      />
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

  // NOTIFICATION (Google Message Style)
  notifCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5 },
  unreadNotif: { backgroundColor: '#fafff9', borderRadius: 15, marginHorizontal: -5, paddingHorizontal: 10 },
  notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1, marginLeft: 15 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  notifTitle: { fontSize: 15, color: K_DARK_BLUE },
  notifTime: { fontSize: 11, color: '#aaa' },
  notifBody: { fontSize: 13, color: '#777' },

  // ALERT (80% Image / 20% Text)
  alertCard: { backgroundColor: '#fff', borderRadius: 20, height: 320, marginBottom: 25, elevation: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  alertImageContainer: { flex: 4 }, // 80% height
  alertImg: { width: '100%', height: '100%' },
  alertCloseBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  alertTextContent: { flex: 1, padding: 15, justifyContent: 'center' }, // 20% height
  alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, width: '75%' },
  alertTime: { fontSize: 10, color: '#aaa' },
  alertDesc: { fontSize: 12, color: '#666' },

  emptyText: { textAlign: 'center', marginTop: 100, color: '#ccc', fontSize: 16 }
});