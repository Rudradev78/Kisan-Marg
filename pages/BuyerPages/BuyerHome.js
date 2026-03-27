import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions,
  StatusBar,
  ImageBackground,
  FlatList,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12'; 

const BANNER_DATA = [
  { id: '1', title: 'Straight from the Farm', image: 'https://i.ytimg.com/vi/18YO__sQJBU/maxresdefault.jpg' },
  { id: '2', title: 'Fresh Organic Produce', image: 'https://d1hm90tax3m3th.cloudfront.net/web/vegetables.jpg' },
  { id: '3', title: 'Quality Grains & Spices', image: 'https://millnest.com/wp-content/uploads/2026/02/Website.png' },
];

export default function BuyerHome({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const flatListRef = useRef(null);

  // 🟢 LOGIC: Track wishlisted IDs and Toast state
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const toastFadeAnim = useRef(new Animated.Value(0)).current;

  // 🟢 RESTORED: Categories array for the Seasonal section
  const categories = [
    { id: '1', name: 'Veggie', sub: 'Vegetables', icon: 'carrot' },
    { id: '2', name: 'Fruits', sub: 'Fresh Fruits', icon: 'food-apple' },
    { id: '3', name: 'Grains', sub: 'Pulses & more', icon: 'barley' }, 
    { id: '4', name: 'Spices', sub: 'Oils & Spices', icon: 'shaker-outline' },
  ];

  const gridProducts = [
    { id: '1', name: 'Organic Potato', price: '10', unit: 'kg', farmer: 'Patanjal', rating: '4.8', img: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)' },
    { id: '2', name: 'Red Tomato', price: '15', unit: 'kg', farmer: 'Toma', rating: '4.5', isBestSeller: true, img: 'https://static.toiimg.com/thumb/imgsize-23456,msid-69972910,width-600,resizemode-4/69972910.jpg' },
    { id: '3', name: 'Beetroot', price: '20', unit: 'kg', farmer: 'Smruti', rating: '3.5', isBestSeller: true, img: 'https://cdn2.stylecraze.com/wp-content/uploads/2013/04/Important-Health-Benefits-Of-Beetroot.jpg.webp' },
    { id: '4', name: 'Green Peas', price: '35', unit: 'kg', farmer: 'Rudra', rating: '4.1', img: 'https://ta-malta.com/wp-content/uploads/2025/05/peas-1.jpg' },
    { id: '5', name: 'Cabbage', price: '25', unit: 'Piece', farmer: 'Pradip', rating: '3.5', isBestSeller: true, img: 'https://tiimg.tistatic.com/fp/1/007/945/pack-of-1-kilogram-round-green-food-grade-natural-fresh-cabbage--003.jpg' },
    { id: '6', name: 'Cucumber', price: '35', unit: 'kg', farmer: 'Partha', rating: '4.8', img: 'https://bombayseeds.com/cdn/shop/files/Cucumbers.jpg?v=1729232030' },
    { id: '7', name: 'Spinach', price: '30', unit: 'Bundle', farmer: 'Ayush', rating: '3.9', isBestSeller: true, img: 'https://m.media-amazon.com/images/I/511mgTRmbHL._AC_UF1000,1000_QL80_.jpg' },
    { id: '8', name: 'Onion', price: '40', unit: 'kg', farmer: 'Hasima', rating: '4.1', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2QWqvi0HtIWfSSDnk7h75I1L-WpccITVrug&s' },
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1, buyer: 'Smruti Ranjan', weight: `1 ${product.unit}` }];
    });
  };

  const handleWishlist = (id) => {
    const isAlreadyWishlisted = wishlistedItems.includes(id);
    if (isAlreadyWishlisted) {
      setWishlistedItems(prev => prev.filter(item => item !== id));
    } else {
      setWishlistedItems(prev => [...prev, id]);
      
      // Trigger Toast Animation
      setShowToast(true);
      Animated.timing(toastFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(toastFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 3000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % BANNER_DATA.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000); 
    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.titleWithUnderline}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.headerUnderline} />
      </View>
    </View>
  );

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
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('BuyerAlertNotification')}>
                  <Ionicons name="notifications-outline" size={20} color={K_GREEN} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ height: 110 }} />

        {/* --- LOCATION & SEARCH --- */}
        <View style={styles.locationSection}>
          <Text style={styles.deliveringText}>Delivering to</Text>
          <View style={styles.locationRow}>
             <Text style={styles.locationBold}>Bhubaneswar, 751001</Text>
             <Ionicons name="chevron-down" size={14} color="#666" style={{marginLeft: 5}}/>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput placeholder="Search fresh harvest..." style={styles.searchInput} value={search} onChangeText={setSearch} placeholderTextColor="#bbb" />
        </View>

        {/* --- BANNER --- */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={BANNER_DATA}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={styles.bannerWrapper}>
                <ImageBackground source={{ uri: item.image }} style={styles.bannerImg} imageStyle={{ borderRadius: 25 }}>
                  <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            )}
            keyExtractor={item => item.id}
          />
          <View style={styles.paginationDots}>
            {BANNER_DATA.map((_, i) => (<View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : null]} />))}
          </View>
        </View>

        <SectionHeader title="Availables near you" />

        {/* --- GRID MAPPED TO DETAILS --- */}
        <View style={styles.grid}>
          {gridProducts.map((p, idx) => {
            const isFav = wishlistedItems.includes(p.id);
            return (
              <TouchableOpacity 
                key={idx} 
                style={styles.productCard} 
                onPress={() => navigation.navigate('ProductDetails', { product: p })}
              >
                <View style={styles.imgWrapper}>
                  <Image source={{ uri: p.img }} style={styles.cropImg} />
                  {p.isBestSeller && <View style={styles.bestSellerBadge}><Text style={styles.bestSellerText}>BEST SELLER</Text></View>}
                  
                  <TouchableOpacity style={styles.wishlistBtn} onPress={() => handleWishlist(p.id)}>
                    <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? "#e74c3c" : K_DARK_BLUE} />
                  </TouchableOpacity>
                </View>
                <View style={styles.infoArea}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color={K_ORANGE} /><Ionicons name="star" size={12} color={K_ORANGE} /><Ionicons name="star" size={12} color={K_ORANGE} /><Ionicons name="star" size={12} color={K_ORANGE} /><Ionicons name="star-half" size={12} color={K_ORANGE} />
                    <Text style={styles.ratingText}> ({p.rating})</Text>
                  </View>
                  <Text style={styles.cropName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.farmerName}>Farmer: {p.farmer}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{p.price}<Text style={styles.unitText}>/{p.unit}</Text></Text>
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(p)}>
                        <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* --- SEASONAL EXTRA --- */}
        <SectionHeader title="Seasonal Extra" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catCard}>
              <ImageBackground source={{ uri: gridProducts[0].img }} style={styles.catBg} imageStyle={{borderRadius: 15}} blurRadius={2}>
                <View style={styles.catOverlay}>
                  <Text style={styles.catMainName}>{cat.name}</Text>
                  <Text style={styles.catSubName}>{cat.sub}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* 🟢 FIXED: WISHLIST TOAST AT THE BOTTOM */}
      {showToast && (
        <Animated.View style={[styles.wishlistToast, { opacity: toastFadeAnim }]}>
           <View style={styles.toastInner}>
             <Ionicons name="heart" size={18} color="#e74c3c" />
             <Text style={styles.wishlistToastText}>Added to your wishlist!</Text>
           </View>
        </Animated.View>
      )}

      {/* --- FLOATING CART --- */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.floatingCart} activeOpacity={0.9} onPress={() => navigation.navigate('Kart', { cartData: cart })}>
          <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.floatingContent}>
            <View style={styles.cartInfo}>
               <View style={styles.cartIconCircle}>
                 <Ionicons name="cart" size={20} color={K_GREEN} />
                 <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
               </View>
               <View style={{marginLeft: 15}}><Text style={styles.floatingTitle}>{cart.length} Item Added</Text></View>
            </View>
            <View style={styles.viewKartRow}><Text style={styles.viewKartText}>View Kart</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingBottom: 40 },
  header: { paddingHorizontal: 15, paddingTop: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoTitleBlock: { flexDirection: 'row', alignItems: 'center' },
  miniWreathLogo: { width: 44, height: 44, resizeMode: 'contain', marginRight: 10 },
  brandTitleText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  brandSloganText: { fontSize: 10, color: '#f0f0f0', marginTop: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  locationSection: { paddingHorizontal: 15, marginTop: 5 },
  deliveringText: { fontSize: 12, color: '#888' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  locationBold: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', marginHorizontal: 15, marginTop: 15, borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: K_DARK_BLUE },
  bannerContainer: { marginTop: 20, alignItems: 'center' },
  bannerWrapper: { width: width, paddingHorizontal: 15 },
  bannerImg: { width: width - 30, height: 260, justifyContent: 'flex-end', overflow: 'hidden' },
  bannerOverlay: { padding: 25, borderRadius: 25, height: '100%', justifyContent: 'flex-end' },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  paginationDots: { flexDirection: 'row', marginTop: -35, zIndex: 20, alignSelf: 'center', marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },
  activeDot: { width: 22, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  sectionHeaderContainer: { marginHorizontal: 20, marginTop: 40, marginBottom: 15 },
  titleWithUnderline: { alignSelf: 'flex-start' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: K_DARK_BLUE },
  headerUnderline: { width: 40, height: 4, backgroundColor: K_GREEN, borderRadius: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginTop: 15, justifyContent: 'space-between' },
  productCard: { width: '47%', backgroundColor: '#fff', borderRadius: 25, marginBottom: 20, elevation: 4, overflow: 'hidden' },
  imgWrapper: { position: 'relative' },
  cropImg: { width: '100%', height: 130 },
  bestSellerBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: K_ORANGE, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  bestSellerText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  wishlistBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  infoArea: { padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingText: { fontSize: 11, color: '#888' },
  cropName: { fontSize: 15, fontWeight: 'bold', color: K_DARK_BLUE },
  farmerName: { fontSize: 11, color: '#999', marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: K_GREEN },
  unitText: { fontSize: 11, color: '#666' },
  addBtn: { backgroundColor: K_GREEN, width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  catScroll: { paddingLeft: 15, marginTop: 15 },
  catCard: { width: 150, height: 100, marginRight: 15 },
  catBg: { flex: 1 }, 
  catOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 15, padding: 15, justifyContent: 'center' },
  catMainName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  catSubName: { fontSize: 11, color: '#fff', marginTop: 3 },

  wishlistToast: { 
    position: 'absolute', 
    bottom: 10, // Positioned at bottom
    left: 0, 
    right: 0, 
    alignItems: 'center',
    zIndex: 100 
  },
  toastInner: {
    backgroundColor: '#fff', 
    paddingHorizontal: 25, 
    paddingVertical: 15, 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    elevation: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  wishlistToastText: { color: K_DARK_BLUE, fontWeight: 'bold', marginLeft: 10, fontSize: 14 },

  floatingCart: { position: 'absolute', bottom: 30, left: 15, right: 15, elevation: 10 },
  floatingContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 20 },
  cartInfo: { flexDirection: 'row', alignItems: 'center' },
  cartIconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: K_GREEN, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: K_DARK_BLUE },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  floatingTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  viewKartRow: { flexDirection: 'row', alignItems: 'center' },
  viewKartText: { color: '#fff', fontWeight: 'bold', marginRight: 8, fontSize: 14 }
});