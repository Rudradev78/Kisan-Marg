import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerProfile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, savings: 0 });

  // --- LOGIC: Fetch User Data from DB on every visit ---
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      const res = await apiClient.get('/auth/stats');
      if (res.data.success) {
        setUser(res.data.user);
        setStats({
          orders: res.data.stats.orders || 0,
          wishlist: res.data.user.wishlist ? res.data.user.wishlist.length : 0,
          savings: 450 // Placeholder until savings logic is added to backend
        });
      }
    } catch (err) {
      console.log("Profile Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'userData', 'kart']);
          navigation.replace('Login');
        } 
      }
    ]);
  };

  const ProfileOption = ({ icon, title, subtitle, onPress, color = K_DARK_BLUE, isLast = false }) => (
    <TouchableOpacity 
      style={[styles.optionRow, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '10' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSub}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={K_GREEN} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- 1. PROFILE HEADER --- */}
        <View style={styles.headerCard}>
          <LinearGradient colors={[K_GREEN, '#8cc63f']} style={styles.headerGradient}>
            <View style={styles.appBranding}>
              <Image 
                source={require('../../assets/App-logo-only-no-bg.png')} 
                style={styles.headerLogo} 
                tintColor="#fff" 
              />
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitleText}>Kisan Marg</Text>
                <Text style={styles.headerSloganText}>A Direct path from Farm to Market</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.dpImageURL || 'https://via.placeholder.com/150' }} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userHandle}>
              {user?.phno ? `+91 ${user.phno}` : ''} {user?.email ? `• ${user.email}` : ''}
            </Text>
          </View>
        </View>

        {/* --- 2. STATS BAR (Real Data) --- */}
        <View style={styles.statsBar}>
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('BuyerOrders')}>
            <Text style={styles.statNumber}>{stats.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Wishlist')}>
            <Text style={styles.statNumber}>{stats.wishlist}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>₹{stats.savings}</Text>
            <Text style={styles.statLabel}>Savings</Text>
          </TouchableOpacity>
        </View>

        {/* --- 3. MENU SECTIONS --- */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Account Settings</Text>
          <View style={styles.card}>
            <ProfileOption 
              icon="person-outline" 
              title="Personal Information" 
              subtitle="Name, Email, Mobile Number"
              onPress={() => navigation.navigate('PersonalInfo')} 
            />
            <ProfileOption 
              icon="location-outline" 
              title="Saved Addresses" 
              subtitle="Home, Office & others"
              onPress={() => navigation.navigate('SavedAddresses')} 
            />
            <ProfileOption 
              icon="notifications-outline" 
              title="Notifications" 
              subtitle="Price alerts & order updates"
              onPress={() => navigation.navigate('BuyerAlertNotification')}
              isLast={true}
            />
          </View>

          <Text style={styles.menuSectionTitle}>Shopping Activity</Text>
          <View style={styles.card}>
            <ProfileOption 
              icon="receipt-outline" 
              title="My Orders" 
              onPress={() => navigation.navigate('BuyerOrders')} 
            />
            <ProfileOption 
              icon="heart-outline" 
              title="Wishlist" 
              onPress={() => navigation.navigate('Wishlist')} 
            />
            <ProfileOption 
              icon="wallet-outline" 
              title="Payments & Refunds" 
              onPress={() => {navigation.navigate('PaymentsRefunds')}} 
              isLast={true}
            />
          </View>

          <Text style={styles.menuSectionTitle}>App Preferences</Text>
          <View style={styles.card}>
            <ProfileOption 
              icon="language-outline" 
              title="Language" 
              subtitle="English (India)"
              onPress={() => {navigation.navigate('Language')}} 
            />
            <ProfileOption 
              icon="help-circle-outline" 
              title="Help & Support" 
              onPress={() => {navigation.navigate('HelpContact')}} 
            />
            <ProfileOption 
              icon="shield-checkmark-outline" 
              title="Privacy Policy" 
              onPress={() => {navigation.navigate('PrivacyPolicy')}} 
              isLast={true}
            />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout from Account</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Kisan Marg v1.0.4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerCard: { height: 260, backgroundColor: '#fff', alignItems: 'center', marginBottom: 60, position: 'relative' },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 150, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  appBranding: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '100%' },
  headerLogo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 12 },
  titleContainer: { flexDirection: 'column', justifyContent: 'center' },
  headerTitleText: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5, lineHeight: 24 },
  headerSloganText: { fontSize: 7, color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600', marginTop: 2, letterSpacing: 0.2 },
  profileInfo: { marginTop: 90, alignItems: 'center', zIndex: 1 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  userName: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 10 },
  userHandle: { fontSize: 12, color: '#888', marginTop: 4 },
  statsBar: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginTop: -30, borderRadius: 20, paddingVertical: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, zIndex: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  statLabel: { fontSize: 11, color: '#aaa', marginTop: 2, textTransform: 'uppercase' },
  statDivider: { width: 1, height: '100%', backgroundColor: '#f0f0f0' },
  menuContainer: { padding: 20 },
  menuSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#aaa', marginBottom: 12, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, marginBottom: 25, elevation: 2 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: K_DARK_BLUE },
  optionSub: { fontSize: 11, color: '#999', marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, marginBottom: 30 },
  logoutText: { marginLeft: 10, color: '#e74c3c', fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 10, marginBottom: 30 }
});