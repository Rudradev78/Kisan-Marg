import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  Dimensions, Modal, FlatList, Alert, Animated, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';

export default function ProductDetails({ navigation, route }) {
  const { productId } = route.params; 
  
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  // Cart Logic States
  const [itemQuantityInCart, setItemQuantityInCart] = useState(0); // Count for THIS product
  const [fullCart, setFullCart] = useState([]); // Full array for floating bar
  
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- REFRESH LOGIC: Runs on every visit ---
  useFocusEffect(
    useCallback(() => {
      refreshAllData();
    }, [productId])
  );

  const refreshAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch current product details from DB
      const res = await apiClient.get(`/products/${productId}`);
      const currentProd = res.data.data;
      setProduct(currentProd);

      // 2. Fetch market products for "More from Market" section
      const marketRes = await apiClient.get('/products/market');
      const filtered = marketRes.data.data.filter(p => p._id !== productId);
      setOtherProducts(filtered);

      // 3. Sync Wishlist status from DB
      const userRes = await apiClient.get('/auth/stats');
      const wishlist = userRes.data.user.wishlist || [];
      setIsWishlisted(wishlist.includes(productId));

      // 4. Sync Cart status from Local Storage
      const stored = await AsyncStorage.getItem('kart');
      if (stored) {
        const kartArr = JSON.parse(stored);
        setFullCart(kartArr);
        const currentItem = kartArr.find(p => p._id === productId);
        setItemQuantityInCart(currentItem ? currentItem.qty : 0);
      } else {
        setFullCart([]);
        setItemQuantityInCart(0);
      }
      
    } catch (err) {
      console.log("Refresh Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const res = await apiClient.post(`/auth/wishlist/${productId}`);
      const updatedWishlist = res.data.wishlist;
      const newState = updatedWishlist.includes(productId);
      setIsWishlisted(newState);
      
      if (newState) {
        triggerToast();
      }
    } catch (err) {
      Alert.alert("Error", "Could not update wishlist");
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setShowToast(false));
    }, 2500);
  };

  const handleAddToCart = async () => {
    try {
      let kart = await AsyncStorage.getItem('kart');
      kart = kart ? JSON.parse(kart) : [];

      const index = kart.findIndex(item => item._id === product._id);
      if (index > -1) {
        kart[index].qty += 1;
      } else {
        kart.push({ ...product, qty: 1 });
      }

      await AsyncStorage.setItem('kart', JSON.stringify(kart));
      
      // Update local states immediately
      setFullCart(kart);
      const updatedItem = kart.find(p => p._id === productId);
      setItemQuantityInCart(updatedItem.qty);

      Alert.alert("Success", "Added to Kart!");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || !product) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* --- 1. IMAGE & HEADER --- */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.productImageURL }} style={styles.mainImg} />
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={K_DARK_BLUE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={toggleWishlist}>
              <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={22} color={isWishlisted ? "#e74c3c" : K_DARK_BLUE} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* --- 2. INFO --- */}
        <View style={styles.infoSection}>
          <View style={styles.badgeRow}>
            <View style={styles.farmerBadge}>
              <MaterialCommunityIcons name="storefront-outline" size={14} color={K_GREEN} />
              <Text style={styles.farmerText}>{product.farmerId?.farmName || "Direct Farm"}</Text>
            </View>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>In Stock: {product.availableQuantity} {product.unitGiven}</Text>
            </View>
          </View>

          <Text style={styles.prodName}>{product.productName}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{product.pricePerUnit}<Text style={styles.unitText}>/{product.unitGiven}</Text></Text>
            <TouchableOpacity style={styles.ratingBox} onPress={() => setShowReviews(true)}>
              <Ionicons name="star" size={14} color={K_ORANGE} />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewLink}> (View Reviews)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIcon}><MaterialCommunityIcons name="truck-delivery-outline" size={24} color={K_GREEN} /></View>
            <View style={{marginLeft: 15}}>
                <Text style={styles.deliveryTitle}>Fast Delivery</Text>
                <Text style={styles.deliverySub}>Estimated: Within 24-48 Hours</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>
            This {product.productName} is sourced directly from {product.farmerId?.farmName}. 
            No middle-man, no preservatives. 100% organic and fresh harvest packed with care 
            for your health.
          </Text>

          {/* --- 3. MORE FROM OUR MARKET --- */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.sectionTitle}>More from our Market</Text>
            <FlatList
              data={otherProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              contentContainerStyle={{ marginTop: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                    style={styles.suggestionCard}
                    onPress={() => navigation.push('ProductDetails', { productId: item._id })}
                >
                  <Image source={{ uri: item.productImageURL }} style={styles.suggestImg} />
                  <Text style={styles.suggestName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.suggestPrice}>₹{item.pricePerUnit}/{item.unitGiven}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* --- 4. BOTTOM ACTIONS --- */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addKartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#fff" style={{marginRight: 10}} />
          <Text style={styles.addKartText}>ADD TO KART {itemQuantityInCart > 0 && `(${itemQuantityInCart})`}</Text>
        </TouchableOpacity>
      </View>

      {/* FLOATING KART BAR */}
      {fullCart.length > 0 && (
        <TouchableOpacity style={styles.floatingCart} onPress={() => navigation.navigate('Kart')}>
          <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.floatingContent}>
            <View style={styles.cartInfo}>
               <View style={styles.cartIconCircle}>
                 <Ionicons name="cart" size={20} color={K_GREEN} />
                 <View style={styles.badge}><Text style={styles.badgeText}>{fullCart.length}</Text></View>
               </View>
               <Text style={styles.floatingTitle}>{fullCart.length} Item Added</Text>
            </View>
            <View style={styles.viewKartRow}><Text style={styles.viewKartText}>View Kart</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {showToast && (
        <Animated.View style={[styles.wishlistToast, { opacity: fadeAnim }]}>
          <Ionicons name="heart" size={18} color="#e74c3c" />
          <Text style={styles.wishlistToastText}>Added to your wishlist!</Text>
        </Animated.View>
      )}
      
      {/* REVIEW MODAL (Untouched UI) */}
      <Modal visible={showReviews} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} onPress={() => setShowReviews(false)} />
          <View style={styles.reviewSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Buyer Reviews</Text>
              <TouchableOpacity onPress={() => setShowReviews(false)}><Ionicons name="close-circle" size={24} color="#ccc" /></TouchableOpacity>
            </View>
            <FlatList
              data={[{ id: '1', user: 'Amit Kumar', rating: 5, comment: 'Very fresh!', date: '2 days ago' }]}
              keyExtractor={item => item.id}
              contentContainerStyle={{padding: 20}}
              renderItem={({item}) => (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{item.user}</Text>
                    <View style={{flexDirection: 'row'}}><Ionicons name="star" size={10} color={K_ORANGE} /></View>
                  </View>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: width, height: height * 0.4, position: 'relative' },
  mainImg: { width: '100%', height: '100%', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  infoSection: { padding: 25 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  farmerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9eb', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  farmerText: { color: K_GREEN, fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
  stockBadge: { backgroundColor: '#fff1f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  stockText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 11 },
  prodName: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  priceText: { fontSize: 28, fontWeight: 'bold', color: K_GREEN },
  unitText: { fontSize: 14, color: '#999', fontWeight: 'normal' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdf7ef', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  ratingText: { fontWeight: 'bold', marginLeft: 5, color: K_DARK_BLUE },
  reviewLink: { fontSize: 11, color: K_GREEN, fontWeight: 'bold' },
  deliveryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 20, marginBottom: 25 },
  deliveryTitle: { fontWeight: 'bold', color: K_DARK_BLUE },
  deliverySub: { fontSize: 12, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 10 },
  descText: { fontSize: 14, color: '#666', lineHeight: 22 },
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  addKartBtn: { backgroundColor: K_GREEN, padding: 18, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  addKartText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  reviewSheet: { backgroundColor: '#fff', height: height * 0.6, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  handle: { width: 40, height: 5, backgroundColor: '#eee', borderRadius: 5, position: 'absolute', top: 10, alignSelf: 'center' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  reviewCard: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9', paddingBottom: 15 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewerName: { fontWeight: 'bold', color: K_DARK_BLUE },
  commentText: { fontSize: 13, color: '#666', marginVertical: 8 },
  reviewDate: { fontSize: 11, color: '#bbb' },
  floatingCart: { position: 'absolute', bottom: 100, left: 15, right: 15, elevation: 10 },
  floatingContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 20 },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  cartIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: K_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  floatingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 12 },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', fontWeight: 'bold', marginRight: 8, fontSize: 13 },
  wishlistToast: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 10, borderWidth: 1, borderColor: '#eee' },
  wishlistToastText: { color: K_DARK_BLUE, fontWeight: 'bold', marginLeft: 10, fontSize: 14 },
  suggestionCard: { width: 140, marginRight: 15, backgroundColor: '#fff', borderRadius: 15, padding: 10, borderWidth: 1, borderColor: '#f0f0f0' },
  suggestImg: { width: '100%', height: 90, borderRadius: 10 },
  suggestName: { fontSize: 13, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 8 },
  suggestPrice: { fontSize: 12, color: K_GREEN, fontWeight: 'bold', marginTop: 2 }
});