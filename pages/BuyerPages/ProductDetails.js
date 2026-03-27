import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  FlatList,
  Alert,
  Animated // 🟢 Added for smooth toast appearance
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';

export default function ProductDetails({ navigation, route }) {
  // 🟢 Receive product data (Handles data from Home or Order History)
  const { product } = route.params || {};
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  // 🟢 State and Animation Ref for the Wishlist Toast
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  if (!product) return null;

  const dummyReviews = [
    { id: '1', user: 'Amit Kumar', rating: 5, comment: 'Very fresh potatoes, reached on time!', date: '2 days ago' },
    { id: '2', user: 'Sonal Singh', rating: 4, comment: 'Good quality, but one was a bit small.', date: '1 week ago' },
    { id: '3', user: 'Rakesh P.', rating: 5, comment: 'Straight from farm feel. Highly recommended.', date: 'Mar 2026' },
  ];

  // 🟢 Updated logic for Toast Popup
  const toggleWishlist = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    
    if (newState) {
      // Show Toast
      setShowToast(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Automatically hide after 3 seconds
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- 1. PRODUCT IMAGE & HEADER --- */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.img }} style={styles.mainImg} />
          <SafeAreaView style={styles.headerOverlay}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={K_DARK_BLUE} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={toggleWishlist}>
              <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={22} color={isWishlisted ? "#e74c3c" : K_DARK_BLUE} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* --- 2. PRODUCT INFO --- */}
        <View style={styles.infoSection}>
          <View style={styles.badgeRow}>
            <View style={styles.farmerBadge}>
              <MaterialCommunityIcons name="storefront-outline" size={14} color={K_GREEN} />
              <Text style={styles.farmerText}>{product.farmer || "Patanjal Farms"}</Text>
            </View>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Available: 50 {product.unit || "kg"}</Text>
            </View>
          </View>

          <Text style={styles.prodName}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{product.price}<Text style={styles.unitText}>/{product.unit || "kg"}</Text></Text>
            <TouchableOpacity style={styles.ratingBox} onPress={() => setShowReviews(true)}>
              <Ionicons name="star" size={14} color={K_ORANGE} />
              <Text style={styles.ratingText}>{product.rating || "4.5"}</Text>
              <Text style={styles.reviewLink}> (View Reviews)</Text>
            </TouchableOpacity>
          </View>

          {/* --- 3. DELIVERY PROMISE --- */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIcon}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={K_GREEN} />
            </View>
            <View style={{marginLeft: 15}}>
                <Text style={styles.deliveryTitle}>Fast Delivery</Text>
                <Text style={styles.deliverySub}>Estimated: Within 24-48 Hours</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>
            This {product.name} is sourced directly from {product.farmer || "local farmers"}. 
            No middle-man, no preservatives. 100% organic and fresh harvest packed with care 
            for your health.
          </Text>
        </View>
      </ScrollView>

      {/* --- 4. ADD TO KART BUTTON --- */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.addKartBtn} 
          onPress={() => setCartCount(prev => prev + 1)}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" style={{marginRight: 10}} />
          <Text style={styles.addKartText}>ADD TO KART</Text>
        </TouchableOpacity>
      </View>

      {/* 🟢 FLOATING KART BAR (Matches Home Page) */}
      {cartCount > 0 && (
        <TouchableOpacity 
          style={styles.floatingCart} 
          onPress={() => navigation.navigate('Kart', { cartData: [{...product, qty: cartCount}] })}
        >
          <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.floatingContent}>
            <View style={styles.cartInfo}>
               <View style={styles.cartIconCircle}>
                 <Ionicons name="cart" size={20} color={K_GREEN} />
                 <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
               </View>
               <Text style={styles.floatingTitle}>{cartCount} Item Added</Text>
            </View>
            <View style={styles.viewKartRow}>
              <Text style={styles.viewKartText}>View Kart</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* 🟢 WISHLIST TOAST POPUP */}
      {showToast && (
        <Animated.View style={[styles.wishlistToast, { opacity: fadeAnim }]}>
          <Ionicons name="heart" size={18} color="#e74c3c" />
          <Text style={styles.wishlistToastText}>Added to your wishlist!</Text>
        </Animated.View>
      )}

      {/* 🟢 YOUTUBE-STYLE REVIEWS MODAL */}
      <Modal visible={showReviews} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} onPress={() => setShowReviews(false)} />
          <View style={styles.reviewSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Buyer Reviews</Text>
              <TouchableOpacity onPress={() => setShowReviews(false)}>
                <Ionicons name="close-circle" size={24} color="#ccc" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={dummyReviews}
              keyExtractor={item => item.id}
              contentContainerStyle={{padding: 20}}
              renderItem={({item}) => (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{item.user}</Text>
                    <View style={styles.smallStars}>
                      {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={10} color={s <= item.rating ? K_ORANGE : "#eee"} />)}
                    </View>
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
  
  // IMAGE SECTION
  imageContainer: { width: width, height: height * 0.45, position: 'relative' },
  mainImg: { width: '100%', height: '100%', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },

  // INFO SECTION
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

  // BOTTOM ACTION
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  addKartBtn: { backgroundColor: K_GREEN, padding: 18, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  addKartText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },

  // MODAL / BOTTOM SHEET
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  reviewSheet: { backgroundColor: '#fff', height: height * 0.6, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  handle: { width: 40, height: 5, backgroundColor: '#eee', borderRadius: 5, position: 'absolute', top: 10, alignSelf: 'center' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  reviewCard: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9', paddingBottom: 15 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewerName: { fontWeight: 'bold', color: K_DARK_BLUE },
  smallStars: { flexDirection: 'row' },
  commentText: { fontSize: 13, color: '#666', marginVertical: 8 },
  reviewDate: { fontSize: 11, color: '#bbb' },

  // FLOATING KART
  floatingCart: { position: 'absolute', bottom: 100, left: 15, right: 15, elevation: 10 },
  floatingContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 20 },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  cartIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: K_GREEN, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  floatingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 12 },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', fontWeight: 'bold', marginRight: 8, fontSize: 13 },

  wishlistToast: { 
    position: 'absolute', 
    bottom: 100, 
    left: 20, 
    right: 20, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  wishlistToastText: { color: K_DARK_BLUE, fontWeight: 'bold', marginLeft: 10, fontSize: 14 }
});