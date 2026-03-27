import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';

export default function BuyerOrders({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');

  // 1. DUMMY DATA WITH DIFFERENT STATUSES
  const allOrders = [
    { 
      id: 'ORD-1001', 
      name: 'Organic Potato', 
      qty: 2, 
      unit: 'kg',
      price: 60,
      status: 'Processing', // Ongoing
      date: 'Ordered on 27 Mar 2026',
      img: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)' 
    },
    { 
      id: 'ORD-1002', 
      name: 'Red Tomato', 
      qty: 1, 
      unit: 'kg',
      price: 45,
      status: 'Delivered', // Completed
      date: 'Delivered on 25 Mar 2026',
      img: 'https://static.toiimg.com/thumb/imgsize-23456,msid-69972910,width-600,resizemode-4/69972910.jpg' 
    },
    { 
      id: 'ORD-1003', 
      name: 'Fresh Spinach', 
      qty: 3, 
      unit: 'Bundle',
      price: 90,
      status: 'Cancelled', // Completed
      date: 'Cancelled on 24 Mar 2026',
      img: 'https://m.media-amazon.com/images/I/511mgTRmbHL._AC_UF1000,1000_QL80_.jpg' 
    },
    { 
      id: 'ORD-1004', 
      name: 'Green Peas', 
      qty: 1, 
      unit: 'kg',
      price: 35,
      status: 'Shipped', // Ongoing
      date: 'Ordered on 26 Mar 2026',
      img: 'https://ta-malta.com/wp-content/uploads/2025/05/peas-1.jpg' 
    },
  ];

  // 2. FILTER LOGIC FOR TABS
  const filteredOrders = allOrders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') return order.status === 'Processing' || order.status === 'Shipped';
    if (activeTab === 'Completed') return order.status === 'Delivered' || order.status === 'Cancelled';
    return true;
  });

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardMain}>
        <Image source={{ uri: item.img }} style={styles.productImg} />
        
        <View style={styles.infoContainer}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { 
                color: item.status === 'Delivered' ? K_GREEN : 
                       item.status === 'Cancelled' ? '#e74c3c' : K_ORANGE 
            }]}>
              {item.status}
            </Text>
            <Text style={styles.orderId}>{item.id}</Text>
          </View>

          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.qtyText}>Qty: {item.qty} {item.unit}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalText}>Total: ₹{item.price}</Text>
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
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#eee" />
            <Text style={styles.emptyTitle}>No {activeTab} Orders</Text>
            <Text style={styles.emptySub}>Looks like you haven't placed any orders here yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
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