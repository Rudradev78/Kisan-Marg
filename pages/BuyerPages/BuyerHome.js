import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  TextInput, Dimensions, StatusBar, ImageBackground, FlatList, Animated, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12'; 

export default function BuyerHome({ navigation }) {
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

  useEffect(() => {
    fetchInitialData();
    loadLocalCart();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Get Live Mandi Prices for Slider
      const marketRes = await apiClient.get('/market/prices');
      setBanners(marketRes.data.prices);

      // 2. Get Farmer Products for Grid
      const productRes = await apiClient.get('/products/market');
      setProducts(productRes.data.data);

      // 3. Get User Wishlist
      const userRes = await apiClient.get('/auth/stats');
      setWishlist(userRes.data.user.wishlist || []);
    } catch (err) {
      console.log("Error loading home:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = async () => {
    const storedCart = await AsyncStorage.getItem('kart');
    if (storedCart) setCart(JSON.parse(storedCart));
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
    } catch (err) { Alert.alert("Error", "Could not update wishlist"); }
  };

  const handleAddToCart = async (product) => {
    const newCart = [...cart];
    const index = newCart.findIndex(item => item._id === product._id);
    if (index > -1) {
      newCart[index].qty += 1;
    } else {
      newCart.push({ ...product, qty: 1 });
    }
    setCart(newCart);
    await AsyncStorage.setItem('kart', JSON.stringify(newCart));
    Alert.alert("Success", `${product.productName} added to Kart!`);
  };

  // Auto-Slider Logic
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        let nextIndex = (activeIndex + 1) % banners.length;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, banners]);

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

        {/* SLIDER (Connected to Mandi Prices) */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={banners}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={styles.bannerWrapper}>
                <ImageBackground source={{ uri: item.image }} style={styles.bannerImg} imageStyle={{ borderRadius: 25 }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>Live: {item.name}</Text>
                    <Text style={{color: '#fff'}}>Market Price: ₹{item.price}/{item.unit}</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Availables near you</Text>
            <View style={styles.headerUnderline} />
        </View>

        {/* GRID (Connected to Products API) */}
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

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={() => navigation.navigate('Kart')}>
          <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.floatingContent}>
            <Text style={styles.floatingTitle}>{cart.length} Item Added</Text>
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

// ... Keep your existing Stylesheet exactly as it was ...
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
  searchPlaceholder: { marginLeft: 10, color: '#999' },
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
  floatingCart: { position: 'absolute', bottom: 20, left: 15, right: 15 },
  floatingContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 15 },
  floatingTitle: { color: '#fff', fontWeight: 'bold' },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', marginRight: 5 }
});