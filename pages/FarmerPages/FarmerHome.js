import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  Dimensions, ImageBackground, FlatList, StatusBar, ActivityIndicator, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 40;
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const LOGO_WREATH = require('../../assets/App-logo-only-no-bg.png');

export default function FarmerHome({ navigation, route }) {
  const pos1Ref = useRef(null);
  const pos2Ref = useRef(null);
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ orders: 0, rating: 0, profit: 0 });
  const [pos1Sliders, setPos1Sliders] = useState([]);
  const [pos2Sliders, setPos2Sliders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const { startNotificationService } = useNotifications();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPos1Idx, setCurrentPos1Idx] = useState(0);
  const [currentPos2Idx, setCurrentPos2Idx] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem('userData');
      const session = storedData ? JSON.parse(storedData) : null;
      const finalUserId = route.params?.userId || session?.userId;
      const role = session?.userType || 'Farmer';

      if (!finalUserId) {
        navigation.replace('RoleSelection');
        return;
      }

      const [profileRes, statsRes, slidersRes, ordersRes] = await Promise.all([
        apiClient.get(`/auth/profile/${finalUserId}`).catch(() => null),
        apiClient.get(`/auth/stats`).catch(() => null), 
        apiClient.get(`/sliders?userType=${role}`).catch(() => null),
        apiClient.get(`/orders/ongoing?farmerId=${finalUserId}`).catch(() => null),
      ]);

      if (profileRes?.data?.success) setUser(profileRes.data.user);
      if (statsRes?.data?.success) setStats(statsRes.data.stats);

      const allSliders = slidersRes?.data?.data || [];
      setPos1Sliders(allSliders.find(s => s.sliderPosition === 1)?.sliderImages || []);
      setPos2Sliders(allSliders.find(s => s.sliderPosition === 2)?.sliderImages || []);
      setOngoingOrders(ordersRes?.data?.data || []); 

    } catch (error) {
      console.log("Dashboard Refresh Error:", error.message);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again.");
        navigation.replace('RoleSelection');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/orders/${id}/status`, { status: newStatus });
      fetchData(); 
    } catch (err) { 
      Alert.alert("Error", "Update failed"); 
    }
  };

  useEffect(() => { 
    fetchData(); 
    startNotificationService();
  }, []);

  // AUTO SLIDE POS1 Logic (Smoothly timed)
  useEffect(() => {
    if (pos1Sliders.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (currentPos1Idx + 1) % pos1Sliders.length;
      pos1Ref.current?.scrollToOffset({
        offset: (nextIndex * SLIDE_WIDTH),
        animated: true,
      });
      setCurrentPos1Idx(nextIndex);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentPos1Idx, pos1Sliders.length]);

  // AUTO SLIDE POS2 Logic
  useEffect(() => {
    if (pos2Sliders.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (currentPos2Idx + 1) % pos2Sliders.length;
      pos2Ref.current?.scrollToOffset({
        offset: nextIndex * SLIDE_WIDTH,
        animated: true,
      });
      setCurrentPos2Idx(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentPos2Idx, pos2Sliders.length]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <ImageBackground source={{ uri: item.imgurl }} style={styles.sliderImage} imageStyle={{ borderRadius: 20 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.sliderOverlay} />
        <View style={styles.sliderContent}>
          <Text style={styles.sliderTitle}>{item.title}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  if (isLoading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN} /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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

        <View style={styles.welcomeSection}>
           <Text style={styles.welcomeText}>Hello, <Text style={styles.boldText}>{user?.name || 'Farmer'}</Text></Text>
           <Text style={styles.subWelcome}>Check your farm status today.</Text>
        </View>

        {/* POSITION 1 SLIDER */}
        <View style={styles.sliderWrapper}>
          <FlatList
            ref={pos1Ref} 
            data={pos1Sliders}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SLIDE_WIDTH}
            decelerationRate="fast"
            snapToAlignment="start"
            keyExtractor={(item) => item._id}
            renderItem={renderSliderItem}
            ListEmptyComponent={<View style={[styles.sliderImage, styles.emptySlider]}><Text>Updates Loading...</Text></View>}
          />
        </View>

        {/* STATS SECTION */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{stats.orders || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statVal}>{stats.rating || '0.0'} ★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₹{stats.profit || 0}</Text>
            <Text style={styles.statLabel}>Profit</Text>
          </View>
        </View>

        {/* ACTION GRID */}
        <View style={styles.actionGrid}>
          {[{ label:'Upload', icon:'cloud-upload-outline', color:'#e8f5e9', target:'UploadProduct' },
            { label:'Stocks', icon:'leaf-outline', color:'#fff3e0', target:'Stocks' },
            { label:'Orders', icon:'cart-outline', color:'#e3f2fd', target:'Orders' },
            { label:'History', icon:'time-outline', color:'#f3e5f5', target:'FarmerHistory' }].map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.actionItem} 
              onPress={() => navigation.navigate(item.target, { userId: user?._id })}
            >
              <View style={[styles.actionIcon, {backgroundColor: item.color}]}><Ionicons name={item.icon} size={26} color={K_DARK_BLUE}/></View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ONGOING ORDERS SECTION */}
        <Text style={styles.sectionTitle}>Ongoing Orders</Text>
        {ongoingOrders.length > 0 ? (
          ongoingOrders.map(item => (
            <View key={item._id} style={styles.orderCard}>
              <View style={styles.cardMain}>
                <View style={styles.infoCol}>
                  <Text style={styles.buyerName}>{item.buyerId?.name || "Buyer"}</Text>
                  <View style={styles.addressRow}>
                     <Ionicons name="location-outline" size={14} color="#888" />
                     <Text style={styles.addressText} numberOfLines={1}>{item.buyerId?.location || "No Address"}</Text>
                  </View>
                  <View style={styles.detailsBox}>
                     <Text style={styles.detailsText}>
                       {item.product?.productName} <Text style={{color: '#ccc'}}>•</Text> {item.quantity}kg <Text style={{color: '#ccc'}}>•</Text> <Text style={styles.priceHighlight}>₹{item.totalPrice}</Text>
                     </Text>
                  </View>
                </View>
                {item.product?.productImageURL && (
                  <Image source={{ uri: item.product.productImageURL }} style={styles.productThumbnail} />
                )}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Packed')}>
                  <Text style={[styles.btnText, {color: item.status === 'Packed' ? '#aaa' : K_DARK_BLUE}]}>Packed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Out for Delivery')}>
                  <Text style={[styles.btnText, {color: item.status === 'Out for Delivery' ? '#aaa' : K_DARK_BLUE}]}>Out Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Completed')}>
                  <Text style={[styles.btnText, {color: K_GREEN}]}>Delivered</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyView}><Text style={styles.emptyText}>No active orders to show.</Text></View>
        )}

        {/* GOVERNMENT NEWS SLIDER */}
        <Text style={styles.sectionTitle}>Government News</Text>
        <FlatList
          ref={pos2Ref}
          data={pos2Sliders}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SLIDE_WIDTH}
          decelerationRate="fast"
          snapToAlignment="start"
          keyExtractor={(item) => item._id}
          renderItem={renderSliderItem}
          ListEmptyComponent={<View style={[styles.sliderImage, styles.emptySlider]}><Text>News Loading...</Text></View>}
        />
        
        <View style={{height: 60}} />
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
  welcomeSection: { paddingHorizontal: 20, marginTop: 20 },
  welcomeText: { fontSize: 22, color: K_DARK_BLUE },
  boldText: { fontWeight: 'bold' },
  subWelcome: { fontSize: 13, color: '#777' },
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
  
  orderCard: { backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 20, marginBottom: 15, marginTop: 10, elevation: 3, overflow: 'hidden' },
  cardMain: { flexDirection: 'row', padding: 18 },
  infoCol: { flex: 1, marginRight: 10 },
  buyerName: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addressText: { fontSize: 12, color: '#888', marginLeft: 4 },
  detailsBox: { backgroundColor: '#f9f9f9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, alignSelf: 'flex-start' },
  detailsText: { fontSize: 13, color: '#555', fontWeight: '500' },
  priceHighlight: { color: K_GREEN, fontWeight: 'bold' },
  productThumbnail: { width: 80, height: 80, borderRadius: 12 },
  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', height: 50 },
  actionBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 11, fontWeight: 'bold' },
  
  emptyView: { padding: 20, alignItems:'center' },
  emptyText: { color: '#999', fontSize: 12 },
  sliderWrapper: { marginTop: 20 },
  slideContainer: { width: SLIDE_WIDTH, paddingHorizontal: 5, marginLeft: 20 },
  sliderImage: { width: '100%', height: 200, justifyContent: 'flex-end', overflow: 'hidden' },
  emptySlider: { marginHorizontal: 20, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  sliderOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  sliderContent: { padding: 15 },
  sliderTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  newsCard: { width: SLIDE_WIDTH - 20, height: 220, marginLeft: 20, justifyContent: 'flex-end', padding: 15, marginTop: 10 },
  newsOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  newsText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});