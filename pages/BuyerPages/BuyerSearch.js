import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Dimensions, Image, FlatList, ActivityIndicator, Alert, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerSearch({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [wishlistPreview, setWishlistPreview] = useState([]);
  const [userWishlistIds, setUserWishlistIds] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Focus effect to refresh all states on visit
  useFocusEffect(
    useCallback(() => {
      loadPersistenceData();
      fetchWishlistData();
      loadLocalCart();
    }, [])
  );

  const loadPersistenceData = async () => {
    const searches = await AsyncStorage.getItem('recentSearches');
    const visited = await AsyncStorage.getItem('recentlyVisited');
    if (searches) setRecentSearches(JSON.parse(searches));
    if (visited) setRecentlyVisited(JSON.parse(visited));
  };

  const fetchWishlistData = async () => {
    try {
      const res = await apiClient.get('/auth/stats');
      const ids = res.data.user.wishlist || [];
      setUserWishlistIds(ids);

      if (ids.length > 0) {
        const prodRes = await apiClient.get('/products/market');
        const filtered = prodRes.data.data.filter(p => ids.includes(p._id)).slice(0, 5);
        setWishlistPreview(filtered);
      }
    } catch (err) { console.log(err); }
  };

  const loadLocalCart = async () => {
    const stored = await AsyncStorage.getItem('kart');
    setCart(stored ? JSON.parse(stored) : []);
  };

  // Logic: Search Substring from DB
  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 1) {
      setLoading(true);
      try {
        const res = await apiClient.get(`/products/search?q=${text}`);
        setSearchResults(res.data.data);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    } else {
      setSearchResults([]);
    }
  };

  const saveSearchAndNavigate = async (product) => {
    // Save to Recent Searches (Text)
    let updatedSearches = [product.productName, ...recentSearches.filter(s => s !== product.productName)].slice(0, 10);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Save to Recently Visited (Image/Obj)
    let updatedVisited = [product, ...recentlyVisited.filter(p => p._id !== product._id)].slice(0, 10);
    await AsyncStorage.setItem('recentlyVisited', JSON.stringify(updatedVisited));

    navigation.navigate('ProductDetails', { productId: product._id });
  };

  const handleWishlist = async (id) => {
    try {
      const res = await apiClient.post(`/auth/wishlist/${id}`);
      setUserWishlistIds(res.data.wishlist);
    } catch (err) { Alert.alert("Error", "Could not update wishlist"); }
  };

  const handleAddToCart = async (product) => {
    let existingKart = [...cart];
    const index = existingKart.findIndex(item => item._id === product._id);
    if (index > -1) existingKart[index].qty += 1;
    else existingKart.push({ ...product, qty: 1 });
    
    setCart(existingKart);
    await AsyncStorage.setItem('kart', JSON.stringify(existingKart));
    Alert.alert("Success", "Added to Kart");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vegetables, fruits..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
            placeholderTextColor="#bbb"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {setSearchQuery(''); setSearchResults([]);}}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        {searchQuery.length > 0 ? (
          /* --- SEARCH RESULTS GRID (Replacing everything) --- */
          <View style={styles.gridSection}>
            {loading ? <ActivityIndicator color={K_GREEN} style={{marginTop: 50}} /> : (
              <View style={styles.grid}>
                {searchResults.map((p) => (
                  <TouchableOpacity key={p._id} style={styles.productCard} onPress={() => saveSearchAndNavigate(p)}>
                    <View style={styles.imgWrapper}>
                      <Image source={{ uri: p.productImageURL }} style={styles.cropImg} />
                      <TouchableOpacity style={styles.wishlistBtn} onPress={() => handleWishlist(p._id)}>
                        <Ionicons name={userWishlistIds.includes(p._id) ? "heart" : "heart-outline"} size={18} color={userWishlistIds.includes(p._id) ? "#e74c3c" : K_DARK_BLUE} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoArea}>
                      <Text style={styles.cropName} numberOfLines={1}>{p.productName}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceText}>₹{p.pricePerUnit}</Text>
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(p)}>
                            <Ionicons name="add" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          /* --- DEFAULT VIEW (Recent & Wishlist) --- */
          <>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.chipContainer}>
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.chip} onPress={() => handleSearch(item)}>
                      <Text style={styles.chipText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {recentlyVisited.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recently Visited</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recentlyVisited.map((p) => (
                    <TouchableOpacity key={p._id} onPress={() => navigation.navigate('ProductDetails', { productId: p._id })}>
                      <Image source={{ uri: p.productImageURL }} style={styles.circleImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {wishlistPreview.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>From your Wishlist</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {wishlistPreview.map((p) => (
                    <TouchableOpacity key={p._id} onPress={() => navigation.navigate('ProductDetails', { productId: p._id })}>
                      <Image source={{ uri: p.productImageURL }} style={styles.squareImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* FLOATING CART (Refreshes on Focus) */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={() => navigation.navigate('Kart')}>
          <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.floatingContent}>
            <View style={styles.cartInfo}>
              <View style={styles.cartIconCircle}>
                <Ionicons name="cart" size={20} color={K_GREEN} />
                <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
              </View>
              <Text style={styles.floatingTitle}>{cart.length} Item Added</Text>
            </View>
            <View style={styles.viewKartRow}><Text style={styles.viewKartText}>View Kart</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></View>
          </LinearGradient>
        </TouchableOpacity>
      )}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff', elevation: 3 },
  backBtn: { padding: 5, marginRight: 10 },
  searchBarContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f6', borderRadius: 12, paddingHorizontal: 12, height: 45 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: K_DARK_BLUE },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  chipText: { fontSize: 12, color: '#666' },
  circleImage: { width: 70, height: 70, borderRadius: 35, marginRight: 15, borderWidth: 1, borderColor: '#eee' },
  squareImage: { width: 100, height: 100, borderRadius: 15, marginRight: 15 },
  gridSection: { padding: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, elevation: 2, overflow: 'hidden' },
  imgWrapper: { position: 'relative' },
  cropImg: { width: '100%', height: 110 },
  wishlistBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  infoArea: { padding: 10 },
  cropName: { fontSize: 13, fontWeight: 'bold', color: K_DARK_BLUE },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  priceText: { fontSize: 14, fontWeight: 'bold', color: K_GREEN },
  addBtn: { backgroundColor: K_GREEN, width: 26, height: 26, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  floatingCart: { position: 'absolute', bottom: 20, left: 15, right: 15 },
  floatingContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 15 },
  floatingTitle: { color: '#fff', fontWeight: 'bold' },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', marginRight: 5 },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  cartIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: K_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  floatingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 12 },
});