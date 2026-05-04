import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  Dimensions, StatusBar, ImageBackground, FlatList, Animated, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerHome({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animation for Wishlist Toast
  const [showToast, setShowToast] = useState(false);
  const toastFadeAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: '1', name: 'Veggie', sub: 'Vegetables', img: 'https://images.unsplash.com/photo-1597362860722-39402c01edbb?q=80&w=1000' },
    { id: '2', name: 'Fruits', sub: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1000' },
    { id: '3', name: 'Grains', sub: 'Pulses & more', img: 'https://images.unsplash.com/photo-1508013861974-9f6347163835?q=80&w=1000' }, 
    { id: '4', name: 'Spices', sub: 'Oils & Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000' },
  ];

  // 1. Initial Market Data Fetch
  useEffect(() => {
    fetchMarketData();
  }, []);

  // 2. Refresh UI elements on screen focus
  useFocusEffect(
    useCallback(() => {
      loadLocalCart();
      refreshUserWishlist();
    }, [])
  );

  const fetchMarketData = async () => {
    try {
      setLoading(true);

      // 🟢 Logic: Check passed param first, fallback to storage
      const userIdFromParam = route.params?.userId;
      const storedData = await AsyncStorage.getItem('userData');
      const session = storedData ? JSON.parse(storedData) : null;

      const finalUserId = userIdFromParam || session?.userId;
      const role = session?.userType || 'Buyer';

      if (!finalUserId) {
        console.log("No Session ID: Returning to Role Selection");
        navigation.replace('RoleSelection');
        return;
      }

      // Parallel API calls for speed
      const [slidersRes, productRes, wishlistRes] = await Promise.all([
        apiClient.get(`/sliders?userType=${role}`).catch(() => null),
        apiClient.get('/products/market').catch(() => null),
        apiClient.get(`/users/profile/${finalUserId}`).catch(() => null)
      ]);

      // Set Banners
      const allSliders = slidersRes?.data?.data || [];
      const pos1 = allSliders.find(s => s.sliderPosition === 1);
      setBanners(pos1 ? pos1.sliderImages : []);

      // Set Products
      setProducts(productRes?.data?.data || []);

      // Set Initial Wishlist
      if (wishlistRes?.data?.success) {
        setWishlist(wishlistRes.data.user.wishlist || []);
      }

    } catch (err) {
      console.log("Buyer Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserWishlist = async () => {
    try {
      const userIdFromParam = route.params?.userId;
      const storedData = await AsyncStorage.getItem('userData');
      const session = storedData ? JSON.parse(storedData) : null;
      
      const finalUserId = userIdFromParam || session?.userId;

      if (finalUserId) {
        const res = await apiClient.get(`/users/profile/${finalUserId}`);
        setWishlist(res.data.user.wishlist || []);
      }
    } catch (err) {
      console.log("Wishlist Sync Error:", err);
    }
  };

  const loadLocalCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('kart');
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (err) {
      console.log("Cart load error:", err);
    }
  };

  const handleWishlist = async (id) => {
    try {
      const res = await apiClient.post(`/auth/wishlist/${id}`);
      setWishlist(res.data.wishlist);
      
      if (!wishlist.includes(id)) {
        setShowToast(true);
        Animated.timing(toastFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        setTimeout(() => {
          Animated.timing(toastFadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setShowToast(false));
        }, 2000);
      }
    } catch (err) { 
      Alert.alert("Error", "Could not update wishlist"); 
    }
  };

  const handleAddToCart = async (product) => {
    try {
      let existingCart = await AsyncStorage.getItem('kart');
      existingCart = existingCart ? JSON.parse(existingCart) : [];
      
      const index = existingCart.findIndex(item => item._id === product._id);
      if (index > -1) {
        existingCart[index].qty += 1;
      } else {
        existingCart.push({ ...product, qty: 1 });
      }
      
      setCart(existingCart);
      await AsyncStorage.setItem('kart', JSON.stringify(existingCart));
      Alert.alert("Success", `${product.productName} added to Kart!`);
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };

  // Auto-Slider Timing
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient colors={[K_GREEN, 'rgba(106, 170, 73, 0.8)', 'transparent']} style={styles.topGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoTitleBlock}>
                <Image source={require('../../assets/App-logo-only-no-bg.png')} style={styles.miniWreathLogo} tintColor="#fff" />
                <View>
                  <Text style={styles.brandTitleText}>Kisan Marg</Text>
                  <Text style={styles.brandSloganText}>A Direct path from Farm to Market</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('BuyerAlertNotification')}>
                <Ionicons name="notifications-outline" size={20} color={K_GREEN} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ height: 110 }} />

        <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('BuyerSearch')}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <Text style={{marginLeft: 10, color: '#bbb'}}>Search fresh harvest...</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.bannerWrapper}>
              <ImageBackground source={{ uri: item.imgurl }} style={styles.bannerImg} imageStyle={{ borderRadius: 25 }}>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                </LinearGradient>
              </ImageBackground>
            </View>
          )}
        />

        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Availables near you</Text>
            <View style={styles.headerUnderline} />
        </View>

        <View style={styles.grid}>
          {products.map((p) => {
            const isFav = wishlist.includes(p._id);
            return (
              <TouchableOpacity key={p._id} style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { productId: p._id })}>
                <View style={styles.imgWrapper}>
                  <Image source={{ uri: p.productImageURL }} style={styles.cropImg} />
                  <TouchableOpacity style={styles.wishlistBtn} onPress={() => handleWishlist(p._id)}>
                    <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? "#e74c3c" : K_DARK_BLUE} />
                  </TouchableOpacity>
                </View>
                <View style={styles.infoArea}>
                  <Text style={styles.cropName} numberOfLines={1}>{p.productName}</Text>
                  <Text style={styles.farmerName}>Farm: {p.farmerId?.farmName}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{p.pricePerUnit}<Text style={styles.unitText}>/{p.unitGiven}</Text></Text>
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(p)}>
                        <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.sectionHeaderContainer}><Text style={styles.sectionTitle}>Seasonal Extra</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catCard}>
              <ImageBackground source={{ uri: cat.img }} style={styles.catBg} imageStyle={{borderRadius: 15}}>
                <View style={styles.catOverlay}>
                  <Text style={styles.catMainName}>{cat.name}</Text>
                  <Text style={styles.catSubName}>{cat.sub}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

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

      {showToast && (
        <Animated.View style={[styles.wishlistToast, { opacity: toastFadeAnim }]}>
            <View style={styles.toastInner}><Ionicons name="heart" size={18} color="#e74c3c" /><Text style={styles.wishlistToastText}>Saved to wishlist!</Text></View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingBottom: 40 },
  header: { paddingHorizontal: 15, paddingTop: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoTitleBlock: { flexDirection: 'row', alignItems: 'center' },
  miniWreathLogo: { width: 44, height: 44, marginRight: 10 },
  brandTitleText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  brandSloganText: { fontSize: 10, color: '#f0f0f0' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', marginHorizontal: 15, borderRadius: 15, paddingHorizontal: 15, height: 50 },
  sectionHeaderContainer: { marginHorizontal: 20, marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  headerUnderline: { width: 40, height: 4, backgroundColor: K_GREEN, marginTop: 4, borderRadius: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'space-between', marginTop: 15 },
  productCard: { width: '47%', backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, elevation: 3, overflow: 'hidden' },
  imgWrapper: { position: 'relative' },
  cropImg: { width: '100%', height: 120 },
  wishlistBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  infoArea: { padding: 10 },
  cropName: { fontSize: 14, fontWeight: 'bold', color: K_DARK_BLUE },
  farmerName: { fontSize: 10, color: '#999' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: K_GREEN },
  unitText: { fontSize: 10, color: '#666' },
  addBtn: { backgroundColor: K_GREEN, width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  catScroll: { paddingLeft: 15, marginTop: 15 },
  catCard: { width: 150, height: 90, marginRight: 15 },
  catBg: { flex: 1 },
  catOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, justifyContent: 'center', padding: 10 },
  catMainName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  catSubName: { color: '#eee', fontSize: 10 },
  bannerWrapper: { width: width, paddingHorizontal: 15, marginTop: 20 },
  bannerImg: { width: width - 30, height: 260, justifyContent: 'flex-end', overflow: 'hidden' },
  bannerOverlay: { padding: 25, borderRadius: 25, height: '100%', justifyContent: 'flex-end' },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  floatingCart: { position: 'absolute', bottom: 20, left: 15, right: 15 },
  floatingContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 15 },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  cartIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: K_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  floatingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 12 },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', marginRight: 5 },
  wishlistToast: { position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  toastInner: { backgroundColor: '#fff', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 15, borderWidth: 1, borderColor: '#f0f0f0' },
  wishlistToastText: { color: K_DARK_BLUE, fontWeight: 'bold', marginLeft: 10, fontSize: 14 },
});