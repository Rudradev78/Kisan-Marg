import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Wishlist({ navigation }) {
  const [wishlistItems, setWishlistItems] = useState([
    { id: '1', name: 'Organic Potato', price: '10', unit: 'kg', img: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg' },
    { id: '2', name: 'Red Tomato', price: '15', unit: 'kg', img: 'https://static.toiimg.com/thumb/imgsize-23456,msid-69972910,width-600,resizemode-4/69972910.jpg' },
  ]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <Image source={{ uri: item.img }} style={styles.itemImg} />
      <TouchableOpacity style={styles.removeIcon} onPress={() => removeItem(item.id)}>
        <Ionicons name="heart" size={20} color="#e74c3c" />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}<Text style={styles.unitText}>/{item.unit}</Text></Text>
        <TouchableOpacity style={styles.cartBtn}>
            <Text style={styles.cartBtnText}>Move to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist ({wishlistItems.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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