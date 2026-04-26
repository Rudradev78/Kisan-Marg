import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Wishlist({ navigation }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlistData();
  }, []);

  const loadWishlistData = async () => {
    try {
      // 1. Get User's wishlist IDs from backend
      const userRes = await apiClient.get('/auth/stats');
      const wishlistIds = userRes.data.user.wishlist || [];

      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      // 2. Fetch all products to match the details
      const prodRes = await apiClient.get('/products/market');
      const allProducts = prodRes.data.data;

      // 3. Filter products that are in the user's wishlist
      const filteredItems = allProducts.filter(p => wishlistIds.includes(p._id));
      setWishlistItems(filteredItems);
    } catch (err) {
      console.log("Wishlist Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      // Toggle API: Removes the ID from the database array
      await apiClient.post(`/auth/wishlist/${id}`);
      setWishlistItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      Alert.alert("Error", "Could not remove item");
    }
  };

  // FIXED LOGIC: Adds to cart WITHOUT removing from wishlist
  const addToCart = async (product) => {
    try {
      // 1. Get existing Kart from storage
      let kart = await AsyncStorage.getItem('kart');
      kart = kart ? JSON.parse(kart) : [];

      // 2. Update quantity if exists, otherwise push new item
      const exists = kart.find(item => item._id === product._id);
      if (exists) {
        exists.qty += 1;
      } else {
        kart.push({ ...product, qty: 1 });
      }

      // 3. Save back to AsyncStorage
      await AsyncStorage.setItem('kart', JSON.stringify(kart));

      Alert.alert("Success", `${product.productName} added to Kart!`);
    } catch (err) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard} 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
    >
      <Image source={{ uri: item.productImageURL }} style={styles.itemImg} />
      <TouchableOpacity style={styles.removeIcon} onPress={() => removeItem(item._id)}>
        <Ionicons name="heart" size={20} color="#e74c3c" />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.itemPrice}>
          ₹{item.pricePerUnit}
          <Text style={styles.unitText}>/{item.unitGiven || 'kg'}</Text>
        </Text>
        {/* Updated function call */}
        <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
            <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist ({wishlistItems.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="heart-dislike-outline" size={80} color="#eee" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  itemCard: { width: (width / 2) - 20, backgroundColor: '#fff', borderRadius: 20, margin: 10, elevation: 3, overflow: 'hidden' },
  itemImg: { width: '100%', height: 120 },
  removeIcon: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  info: { padding: 12 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: K_DARK_BLUE },
  itemPrice: { fontSize: 16, fontWeight: '900', color: K_GREEN, marginVertical: 5 },
  unitText: { fontSize: 11, fontWeight: 'normal', color: '#888' },
  cartBtn: { backgroundColor: K_DARK_BLUE, paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  cartBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#ccc', fontSize: 16, marginTop: 15 }
});