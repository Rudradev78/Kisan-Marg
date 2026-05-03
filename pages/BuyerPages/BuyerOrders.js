import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';

export default function BuyerOrders({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: Fetch Orders every time page is focused ---
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/orders/buyer');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.log("Order Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- TAB FILTERING LOGIC ---
  const ongoingStatuses = ['Requested', 'Accepted', 'Packed', 'Out for Delivery'];
  const completedStatuses = ['Completed', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') return ongoingStatuses.includes(order.status);
    if (activeTab === 'Completed') return completedStatuses.includes(order.status);
    return true;
  });

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardMain}>
        {/* Mapping to product.productImageURL from populate */}
        <Image 
          source={{ uri: item.product?.productImageURL || 'https://via.placeholder.com/150' }} 
          style={styles.productImg} 
        />
        
        <View style={styles.infoContainer}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { 
                color: item.status === 'Completed' ? K_GREEN : 
                       item.status === 'Cancelled' ? '#e74c3c' : K_ORANGE 
            }]}>
              {item.status}
            </Text>
            {/* Showing last 6 chars of MongoDB ID */}
            <Text style={styles.orderId}>#{item._id.slice(-6).toUpperCase()}</Text>
          </View>

          <Text style={styles.productName}>{item.product?.productName || 'Product Removed'}</Text>
          <Text style={styles.qtyText}>Qty: {item.quantity} {item.product?.unitGiven || 'unit'}</Text>
          <Text style={styles.dateText}>
            {item.status === 'Completed' ? 'Delivered' : item.status === 'Cancelled' ? 'Cancelled' : 'Ordered'} on {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalText}>Total: ₹{item.totalPrice}</Text>
        <TouchableOpacity 
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('OrderDetails', { order: item })}
        >
          <Text style={styles.detailsBtnText}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={K_GREEN} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      {/* --- TAB BAR --- */}
      <View style={styles.tabBar}>
        {['All', 'Ongoing', 'Completed'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- ORDERS LIST --- */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#eee" />
            <Text style={styles.emptyTitle}>No {activeTab} Orders</Text>
            <Text style={styles.emptySub}>Looks like you haven't placed any orders in this category yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },

  tabBar: { flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#f0f0f0' },
  activeTabItem: { borderBottomColor: K_GREEN },
  tabText: { fontSize: 14, color: '#999', fontWeight: '600' },
  activeTabText: { color: K_GREEN, fontWeight: 'bold' },

  orderCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, padding: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  productImg: { width: 80, height: 80, borderRadius: 15 },
  infoContainer: { flex: 1, marginLeft: 15 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  orderId: { fontSize: 11, color: '#bbb' },
  productName: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  qtyText: { fontSize: 13, color: '#777', marginTop: 2 },
  dateText: { fontSize: 12, color: '#aaa', marginTop: 5 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f8f8f8' },
  totalText: { fontSize: 15, fontWeight: 'bold', color: K_DARK_BLUE },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsBtnText: { color: K_GREEN, fontWeight: 'bold', fontSize: 13, marginRight: 5 },

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginTop: 10 },
  emptySub: { fontSize: 14, color: '#ddd', textAlign: 'center', marginTop: 5, paddingHorizontal: 40 }
});