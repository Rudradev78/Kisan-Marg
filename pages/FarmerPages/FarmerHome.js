import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  Dimensions, ImageBackground, FlatList, StatusBar, ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const LOGO_WREATH = require('../../assets/App-logo-only-no-bg.png');
const END_OF_THE_PAGE = require('../../assets/Lantern-bro.png');    

export default function FarmerHome({ navigation }) {
  const pos1Ref = useRef(null);
  const pos2Ref = useRef(null);
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ orders: 0, rating: 0, profit: 0 });
  const [pos1Sliders, setPos1Sliders] = useState([]);
  const [pos2Sliders, setPos2Sliders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPos1Idx, setCurrentPos1Idx] = useState(0);
  const [currentPos2Idx, setCurrentPos2Idx] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const storedUser = await AsyncStorage.getItem('userData');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      const userType = parsedUser?.userType || 'Farmer';

      const statsRes   = await apiClient.get('/auth/stats').catch(() => null);
      const slidersRes = await apiClient.get(`/sliders?userType=${userType}`).catch(() => null);
      const ordersRes  = await apiClient.get('/orders/ongoing').catch(() => null);
      const priceRes   = await apiClient.get('/market/prices').catch(() => null);

      setStats(statsRes?.data?.stats || { orders: 0, rating: 0, profit: 0 });

      const allSliders = slidersRes?.data?.data || [];

      const pos1 = allSliders.find(s => s.sliderPosition === 1);
      const pos2 = allSliders.find(s => s.sliderPosition === 2);

      setPos1Sliders(pos1 ? pos1.sliderImages : []);
      setPos2Sliders(pos2 ? pos2.sliderImages : []);

      setOngoingOrders(ordersRes?.data?.orders || []);
      setMarketPrices(priceRes?.data?.prices || []);

    } catch (error) {
      console.log("Dashboard Error:", error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => { fetchData(); }, []);

  // ✅ AUTO SLIDE POS1
  useEffect(() => {
  if (pos1Sliders.length === 0) return;

  const interval = setInterval(() => {
    const nextIndex = (currentPos1Idx + 1) % pos1Sliders.length;

    pos1Ref.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    setCurrentPos1Idx(nextIndex);
  }, 3500);

  return () => clearInterval(interval);
}, [currentPos1Idx, pos1Sliders.length]);

  // ✅ AUTO SLIDE POS2
  useEffect(() => {
    if (pos2Sliders.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentPos2Idx + 1) % pos2Sliders.length;

      pos2Ref.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentPos2Idx(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentPos2Idx, pos2Sliders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN} /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1 & 2. STATIC HEADER & SEARCH */}
      <LinearGradient colors={[K_GREEN, 'rgba(106, 170, 73, 0.9)', 'transparent']} style={styles.topGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image source={LOGO_WREATH} style={styles.miniLogo} resizeMode="contain" />
              <View style={styles.brandInfo}>
                <Text style={styles.appName}>Kisan Marg</Text>
                <Text style={styles.slogan}>A Direct Path from Farm to Market</Text>
              </View>
              <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('FarmerAlertNotification')}>
                <Ionicons name="notifications-outline" size={24} color={K_GREEN} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ height: 80 }} />

        {/* 3. POSITION 1 FULL SLIDER */}
        <View style={styles.sliderWrapper}>
          {pos1Sliders.length > 0 ? (
            <FlatList
              ref={pos1Ref} 
              data={pos1Sliders}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentPos1Idx(index);
              }}
              renderItem={({ item }) => (
                <ImageBackground
                  source={{ uri: item.imgurl }}
                  style={styles.sliderImage}
                >
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.sliderOverlay} />
                  <View style={styles.sliderContent}>
                    <Text style={styles.sliderTitle}>{item.title}</Text>
                  </View>
                </ImageBackground>
              )}
            />
          ) : (
            <View style={[styles.sliderImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>No sliders available</Text>
            </View>
          )}
        </View>

        {/* 4. STATS SECTION */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text style={styles.statVal}>{stats.orders}</Text><Text style={styles.statLabel}>Orders</Text></View>
          <View style={[styles.statBox, styles.statBorder]}><Text style={styles.statVal}>{stats.rating} ★</Text><Text style={styles.statLabel}>Rating</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>₹{stats.profit}</Text><Text style={styles.statLabel}>Profit</Text></View>
        </View>

        {/* 5. ACTION GRID */}
        <View style={styles.actionGrid}>
          {[{ label:'Upload', icon:'cloud-upload-outline', color:'#e8f5e9', target:'UploadProduct' },
            { label:'Stocks', icon:'leaf-outline', color:'#fff3e0', target:'Stocks' },
            { label:'Orders', icon:'cart-outline', color:'#e3f2fd', target:'Orders' },
            { label:'History', icon:'time-outline', color:'#f3e5f5', target:'FarmerHistory' }].map((item, i) => (
            <TouchableOpacity key={i} style={styles.actionItem} onPress={() => navigation.navigate(item.target)}>
              <View style={[styles.actionIcon, {backgroundColor: item.color}]}><Ionicons name={item.icon} size={26} color={K_DARK_BLUE}/></View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 6. ONGOING ORDERS */}
        <Text style={styles.sectionTitle}>Ongoing Orders</Text>
        {ongoingOrders.length > 0 ? (
          ongoingOrders.map(order => (
            <View key={order._id} style={styles.orderCard}>{/* Order Content */}</View>
          ))
        ) : (
          <View style={styles.emptyView}><Text style={styles.emptyText}>No ongoing orders.</Text></View>
        )}

        <Text style={styles.sectionTitle}>Government News</Text>
        <FlatList
          ref={pos2Ref}
          data={pos2Sliders}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (width - 80));
            setCurrentPos2Idx(index);
          }}
          getItemLayout={(data, index) => ({
            length: width - 80,
            offset: (width - 80) * index,
            index,
          })}
          renderItem={({ item }) => (
            <ImageBackground
              source={{ uri: item.imgurl }}
              style={styles.newsCard}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.newsOverlay} />
              <Text style={styles.newsText}>{item.title}</Text>
            </ImageBackground>
          )}
        />


        {/* 8. MARKET PRICES (10 VEGETABLES) */}
        <Text style={styles.sectionTitle}>Mandi Price (Daily Use)</Text>
        <View style={styles.marketList}>
          {marketPrices.map((item) => (
            <View key={item.id} style={styles.marketPriceCard}>
              <Image source={{ uri: item.image }} style={styles.marketCropImg} />
              <View style={styles.marketCropInfo}>
                <Text style={styles.marketCropName}>{item.name}</Text>
                <Text style={styles.marketLocName}>{item.market}</Text>
              </View>
              <Text style={[styles.marketPriceVal, {color: item.trend === 'up' ? '#28a745' : '#dc3545'}]}>
                ₹{item.price}<Text style={styles.marketUnit}> /Q</Text>
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.endSection}>
           <Image source={END_OF_THE_PAGE} style={styles.endImg} resizeMode="contain" />
           <Text style={styles.endText}>Kisan Marg: Farm to Market</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  scrollContent: { paddingBottom: 50 },
  topGradient: { position:'absolute', top:0, left:0, right:0, zIndex:10, paddingBottom:15 },
  header: { paddingHorizontal: 20, paddingTop: 5 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  miniLogo: { width: 50, height: 50 },
  brandInfo: { marginLeft: 10, flex: 1 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  slogan: { fontSize: 10, color: '#f0f0f0' },
  notifBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 12 },
  notifDot: { position:'absolute', top:10, right:10, width:8, height:8, borderRadius:4, backgroundColor:'#e74c3c' },
  welcomeWrapper: { marginHorizontal: 20, height: 180, borderRadius: 25, overflow: 'hidden', marginTop: 30, elevation: 5 },
  dynamicBg: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  innerGradient: { ...StyleSheet.absoluteFillObject },
  welcomeContent: { padding: 15 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  nameText: { textDecorationLine: 'underline' },
  dynamicQuote: { color: '#eee', fontSize: 12, marginTop: 5 },
  statsContainer: { flexDirection: 'row', backgroundColor: K_DARK_BLUE, marginHorizontal: 20, borderRadius: 20, padding: 15, marginTop: 20 },
  statBox: { alignItems: 'center', flex: 1 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statVal: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 10, color: '#aaa' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIcon: { padding: 12, borderRadius: 15, marginBottom: 5 },
  actionLabel: { fontSize: 11, fontWeight: 'bold', color: K_DARK_BLUE },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginTop: 30, color: K_DARK_BLUE },
  emptyView: { padding: 20, alignItems:'center' },
  emptyText: { color: '#999', fontSize: 12 },
  newsCard: { width: width - 80, height: 220, marginLeft: 20, justifyContent: 'flex-end', padding: 15 },
  newsOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  newsText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  marketList: { paddingHorizontal: 20, marginTop: 15 },
  marketPriceCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  marketCropImg: { width: 45, height: 45, borderRadius: 10 },
  marketCropInfo: { flex: 1, marginLeft: 12 },
  marketCropName: { fontSize: 15, fontWeight: 'bold' },
  marketLocName: { fontSize: 10, color: '#888' },
  marketPriceVal: { fontSize: 15, fontWeight: 'bold' },
  marketUnit: { fontSize: 10, color: '#666' },
  endSection: { alignItems: 'center', marginTop: 30 },
  endImg: { width: 100, height: 100 },
  endText: { color: '#ccc', fontSize: 10 },
  sliderWrapper: {
  marginTop: 100,
},

sliderImage: {
  width: width - 40,
  height: 220,
  marginHorizontal: 20,
  borderRadius: 20,
  overflow: 'hidden',
  justifyContent: 'flex-end',
},

sliderOverlay: {
  ...StyleSheet.absoluteFillObject,
},

sliderContent: {
  padding: 15,
},

sliderTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
});