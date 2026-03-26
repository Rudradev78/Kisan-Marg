import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ImageBackground,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const LOGO_WREATH = require('../../assets/App-logo-only-no-bg.png');
const END_OF_THE_PAGE = require('../../assets/Lantern-bro.png');    

export default function FarmerHome({ navigation }) {
  const newsRef = useRef(null);
  const [userName, setUserName] = useState("Rajesh"); 
  const [isExistingUser, setIsExistingUser] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);

  // 1. DYNAMIC DATA: Welcome Section
  const dashboardData = [
    {
      quote: "Agriculture is the most noble employment of man.",
      img: { uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000' },
      icon: "leaf"
    },
    {
      quote: "Farming is a profession of hope.",
      img: { uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000' },
      icon: "sunny"
    },
    {
      quote: "Farmers are the backbone of our country.",
      img: { uri: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000' },
      icon: "people"
    }
  ];

  // 2. DYNAMIC DATA: News Section
  const newsData = [
    { id: '1', title: "New Government Subsidy for Solar Pumps announced for 2026...", image: 'https://sunapecopower.com/wp-content/uploads/2023/08/4.jpg' },
    { id: '2', title: "Monsoon expected to hit early this year. Prepare your soil...", image: 'https://s.abcnews.com/images/US/180711_vod_orig_monsoon_hpMain_16x9_992.jpg' },
    { id: '3', title: "Market Demand: Organic Turmeric prices expected to rise 20%...", image: 'https://housing.com/news/wp-content/uploads/2024/04/Can-you-buy-a-property-below-its-market-value-f.jpg' }
  ];

  // 3. DYNAMIC DATA: Market Prices
  const marketPrices = [
    { id: '1', name: 'Cotton', market: 'City Crop Market', price: '250', unit: 'Q', trend: 'up', img: 'https://5.imimg.com/data5/ANDROID/Default/2021/3/XN/ZZ/LY/125301824/product-jpeg-500x500.jpg' },
    { id: '2', name: 'Ginger', market: 'Lender Cart House', price: '68', unit: 'kg', trend: 'down', img: 'https://m.media-amazon.com/images/I/61Nl-HhNf2L._AC_UF1000,1000_QL80_.jpg' },
    { id: '3', name: 'Chillies', market: 'City Corp Market', price: '168', unit: 'Q', trend: 'up', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIsG0rT_6Z_P9S5E5o-GzXnS76I0A3p2R56Q&s' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % dashboardData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (newsIndex + 1) % newsData.length;
      setNewsIndex(nextIndex);
      newsRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [newsIndex]);

  const onNewsScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width - 20));
    setNewsIndex(index);
  };

  // Helper component to render the Adjusted Headings
  const SectionHeader = ({ title, showSeeAll = false }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.titleWithUnderline}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.headerUnderline} />
      </View>
      {showSeeAll && (
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All →</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* --- 1. TOP GRADIENT HEADER --- */}
      <LinearGradient colors={[K_GREEN, 'rgba(106, 170, 73, 0.8)', 'transparent']} style={styles.topGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image source={LOGO_WREATH} style={styles.miniLogo} resizeMode="contain" />
              <View style={styles.brandInfo}>
                <Text style={styles.appName}>Kisan Marg</Text>
                <Text style={styles.slogan}>A Direct Path from Farm to Market</Text>
              </View>
              <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" size={22} color={K_GREEN} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={{ height: 100 }} />

        {/* --- 2. DYNAMIC WELCOME SECTION --- */}
        <View style={styles.welcomeWrapper}>
          <ImageBackground source={dashboardData[currentIdx].img} style={styles.dynamicBg}>
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.innerGradient} />
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeText}>
                {isExistingUser ? "Welcome Back," : "Welcome,"} 
                <Text style={styles.nameText}> {userName || "Farmer"}</Text>
              </Text>
              <View style={styles.quoteRow}>
                <Ionicons name={dashboardData[currentIdx].icon} size={20} color="#fff" />
                <Text style={styles.dynamicQuote}>{dashboardData[currentIdx].quote}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* --- 3. STATS SECTION --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text style={styles.statVal}>50</Text><Text style={styles.statLabel}>Total Order</Text></View>
          <View style={[styles.statBox, styles.statBorder]}><Text style={styles.statVal}>4.8 ★</Text><Text style={styles.statLabel}>Ratings</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>₹25k</Text><Text style={styles.statLabel}>Total Profit</Text></View>
        </View>

        {/* --- 4. ACTION GRID --- */}
        <View style={styles.actionGrid}>
          {[
            { label: 'Upload', icon: 'cloud-upload-outline', color: '#e8f5e9', target: 'UploadProduct' },
            { label: 'Stocks', icon: 'leaf-outline', color: '#fff3e0', target: 'Stocks' },
            { label: 'Orders', icon: 'cart-outline', color: '#e3f2fd', target: 'Orders' },
            { label: 'History', icon: 'time-outline', color: '#f3e5f5', target: 'FarmerHistory' }
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.actionItem} onPress={() => navigation.navigate(item.target)}>
              <View style={[styles.actionIcon, {backgroundColor: item.color}]}>
                <Ionicons name={item.icon} size={26} color={K_DARK_BLUE} />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- 5. ONGOING ORDERS (Adjusted Heading) --- */}
        <SectionHeader title="Ongoing Orders" showSeeAll={true} />

        <View style={styles.orderCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)' }} style={styles.newProductImg} />
            <View style={styles.statusBadge}><Text style={styles.statusText}>READY</Text></View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.namePriceRow}>
              <View style={{flex: 1}}>
                 <Text style={styles.productNameNew}>Organic Potato</Text>
                 <Text style={styles.buyerNameNew}>Buyer: Smruti Ranjan</Text>
              </View>
              <View style={styles.buyerRatingBox}>
                 <Text style={styles.buyerRatingText}>4.5</Text>
                 <Ionicons name="star" size={10} color="#fff" />
              </View>
            </View>
            <View style={styles.specIconRow}>
              <View style={styles.specItem}><Ionicons name="scale" size={12} color="#666" /><Text style={styles.specText}>5 KG</Text></View>
              <View style={styles.specItem}><Ionicons name="location" size={12} color="#666" /><Text style={styles.specText}>Bhubaneswar</Text></View>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.priceActionRow}>
              <View><Text style={styles.priceLabelText}>Total</Text><Text style={styles.newTotalPrice}>₹150</Text></View>
              <TouchableOpacity style={styles.acceptOrderBtn}><Text style={styles.btnTextNew}>Accept</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- 6. AGRICULTURAL NEWS (Adjusted Heading) --- */}
        <SectionHeader title="Agricultural News" />
        
        <FlatList
          ref={newsRef}
          data={newsData}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - 20}
          decelerationRate="fast"
          onMomentumScrollEnd={onNewsScrollEnd}
          contentContainerStyle={styles.newsSlider}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9}>
              <ImageBackground source={{ uri: item.image }} style={styles.newsCard} imageStyle={{ borderRadius: 20 }}>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.newsOverlay} />
                <Text style={styles.newsText}>{item.title}</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />

        {/* --- 7. MARKET PRICES TODAY (Adjusted Heading) --- */}
        <SectionHeader title="Market Prices Today" />
        
        <View style={styles.marketList}>
          {marketPrices.map((item) => (
            <View key={item.id} style={styles.marketPriceCard}>
              <Image source={{ uri: item.img }} style={styles.marketCropImg} />
              <View style={styles.marketCropInfo}>
                <Text style={styles.marketCropName}>{item.name}</Text>
                <Text style={styles.marketLocName}>{item.market}</Text>
              </View>
              <View style={styles.marketPriceDetails}>
                 <View style={styles.trendRow}>
                    <Ionicons 
                      name={item.trend === 'up' ? "caret-up" : "caret-down"} 
                      size={16} 
                      color={item.trend === 'up' ? "#28a745" : "#dc3545"} 
                    />
                    <Text style={[styles.marketPriceVal, {color: item.trend === 'up' ? "#28a745" : "#dc3545"}]}>
                      ₹ {item.price} <Text style={styles.marketUnit}>/ {item.unit}</Text>
                    </Text>
                 </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.endSection}>
           <Image source={END_OF_THE_PAGE} style={styles.dummyIllustration} resizeMode="contain" />
           <Text style={styles.endText}>End of the page</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  scrollContent: { paddingBottom: 100 },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingBottom: 50 },
  header: { paddingHorizontal: 20, paddingTop: 5 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  miniLogo: { width: 50, height: 50 },
  brandInfo: { marginLeft: 10, flex: 1 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  slogan: { fontSize: 10, color: '#f0f0f0', fontWeight: '500' },
  searchBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },

  welcomeWrapper: { marginHorizontal: 0, height: 250, marginBottom: 25, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6 },
  dynamicBg: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  innerGradient: { ...StyleSheet.absoluteFillObject },
  welcomeContent: { padding: 20, zIndex: 2 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  nameText: { color: '#fff', textDecorationLine: 'underline' },
  quoteRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dynamicQuote: { flex: 1, color: '#eee', fontSize: 13, fontStyle: 'italic', marginLeft: 10, lineHeight: 18 },

  statsContainer: { flexDirection: 'row', backgroundColor: K_DARK_BLUE, marginHorizontal: 20, borderRadius: 25, padding: 22, justifyContent: 'space-between', elevation: 5 },
  statBox: { alignItems: 'center', flex: 1 },
  statBorder: { borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)' },
  statVal: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#ccc', marginTop: 4 },

  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25 },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIcon: { padding: 15, borderRadius: 20, marginBottom: 8, elevation: 2 },
  actionLabel: { fontSize: 12, fontWeight: '700', color: K_DARK_BLUE },

  // --- ADJUSTED HEADING STYLES ---
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 15
  },
  titleWithUnderline: {
    alignSelf: 'flex-start'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: K_DARK_BLUE,
    letterSpacing: 0.5
  },
  headerUnderline: {
    width: 40,
    height: 4,
    backgroundColor: K_GREEN,
    borderRadius: 2,
    marginTop: 2
  },
  seeAllText: {
    fontSize: 13,
    color: K_GREEN,
    fontWeight: '800'
  },

  // Ongoing Orders Section
  orderCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, elevation: 4, overflow: 'hidden', marginBottom: 15 },
  imageContainer: { width: '35%', height: 160 },
  newProductImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  statusBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(106, 170, 73, 0.9)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  detailsContainer: { flex: 1, padding: 15, justifyContent: 'space-between' },
  namePriceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productNameNew: { fontSize: 15, fontWeight: '800', color: K_DARK_BLUE },
  buyerNameNew: { fontSize: 11, color: '#888' },
  buyerRatingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: K_DARK_BLUE, paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5 },
  buyerRatingText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginRight: 2 },
  specIconRow: { flexDirection: 'row', marginTop: 8 },
  specItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  specText: { fontSize: 11, color: '#666', marginLeft: 4 },
  dividerLine: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  priceActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabelText: { fontSize: 10, color: '#888' },
  newTotalPrice: { fontSize: 17, fontWeight: '800', color: K_GREEN },
  acceptOrderBtn: { backgroundColor: K_GREEN, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  btnTextNew: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  newsSlider: { paddingHorizontal: 10 },
  newsCard: { width: width - 40, height: 250, marginHorizontal: 10, justifyContent: 'flex-end', padding: 18, elevation: 4 },
  newsOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  newsText: { color: '#fff', fontWeight: '700', fontSize: 15, lineHeight: 22, zIndex: 2 },

  marketList: { paddingHorizontal: 20, marginBottom: 20 },
  marketPriceCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 18, 
    alignItems: 'center', 
    marginBottom: 12,
    elevation: 3
  },
  marketCropImg: { width: 55, height: 55, borderRadius: 12 },
  marketCropInfo: { flex: 1, marginLeft: 15 },
  marketCropName: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  marketLocName: { fontSize: 12, color: '#888', marginTop: 2 },
  marketPriceDetails: { alignItems: 'flex-end' },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  marketPriceVal: { fontSize: 17, fontWeight: '800', marginLeft: 4 },
  marketUnit: { fontSize: 12, fontWeight: '500', color: '#666' },

  endSection: { alignItems: 'center', marginTop: 60, paddingBottom: 30 },
  dummyIllustration: { width: 200, height: 200 },
  endText: { color: '#bbb', marginTop: -20, fontSize: 13, fontWeight: '600' }
});