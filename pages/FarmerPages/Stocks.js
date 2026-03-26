import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Stocks({ navigation }) {
  const stockData = [
    { 
      id: '1', 
      name: 'Organic Potato', 
      price: '70', 
      available: '150kg', 
      orders: '12', 
      rating: '4.8',
      image: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)'
    },
    { 
      id: '2', 
      name: 'Red Onion', 
      price: '45', 
      available: '200kg', 
      orders: '8', 
      rating: '4.5',
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=1000'
    },
  ];

  const renderStockCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.mainInfo}>
        <View style={styles.leftCol}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{item.price}/kg</Text>
            <Text style={styles.availableText}>{item.available} available</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>{item.orders} orders</Text>
            <View style={styles.ratingBox}>
               <Text style={styles.ratingText}>{item.rating}</Text>
               <Ionicons name="star" size={12} color="#FFD700" />
               <Text style={styles.ratingLabel}> Rating</Text>
            </View>
          </View>
        </View>
        <Image source={{ uri: item.image }} style={styles.productImg} />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={18} color="#dc3545" />
          <Text style={[styles.btnText, {color: '#dc3545'}]}> Delete</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="create-outline" size={18} color={K_DARK_BLUE} />
          <Text style={[styles.btnText, {color: K_DARK_BLUE}]}> Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- 1. HEADER (Now with Search) --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory (Stocks)</Text>
        {/* Swapped Add for Search */}
        <TouchableOpacity 
          style={styles.searchHeaderBtn} 
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={stockData}
        keyExtractor={item => item.id}
        renderItem={renderStockCard}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* --- 2. FLOATING ACTION BUTTON (Add Product) --- */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('UploadProduct')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  searchHeaderBtn: { padding: 5 },
  
  listPadding: { padding: 15, paddingBottom: 100 }, // Added padding so FAB doesn't hide text
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginBottom: 20, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    overflow: 'hidden'
  },
  
  mainInfo: { flexDirection: 'row', padding: 20 },
  leftCol: { flex: 1 },
  productName: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: K_GREEN, marginRight: 15 },
  availableText: { fontSize: 13, color: '#666', fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { fontSize: 13, color: '#888', marginRight: 15 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: K_DARK_BLUE, marginRight: 2 },
  ratingLabel: { fontSize: 12, color: '#888' },
  productImg: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#f0f0f0' },
  
  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', height: 50 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 14 },
  verticalDivider: { width: 1, backgroundColor: '#f0f0f0', height: '100%' },

  // --- FLOATING ACTION BUTTON STYLES ---
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: K_GREEN,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  }
});