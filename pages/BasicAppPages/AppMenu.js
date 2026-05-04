import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function AppMenu({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Buyer');

  // Load the current role from session if not provided in params
  useEffect(() => {
    const checkRole = async () => {
      try {
        const session = await AsyncStorage.getItem('userData');
        if (session) {
          const { userType } = JSON.parse(session);
          setRole(userType || route.params?.userRole || 'Buyer');
        }
      } catch (e) {
        console.log("Error loading role:", e);
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, []);

  const menuOptions = [
    { 
      id: '1', 
      title: 'Profile', 
      icon: 'person-outline', 
      target: role.toLowerCase() === 'farmer' ? 'FarmerProfile' : 'BuyerProfile' 
    },
    { id: '2', title: 'Language', icon: 'language-outline', target: 'Language' },
    { id: '3', title: 'About Kisan Marg', icon: 'leaf-outline', target: 'AboutApp' },
    { id: '4', title: 'Help & Contact', icon: 'headset-outline', target: 'HelpContact' },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout? Your active session will be cleared.", 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              // 🟢 ERASING THE UNIFIED SESSION
              await AsyncStorage.removeItem('userData');
              
              console.log("✅ Session Terminated. Redirecting...");

              // 🟢 RESET NAVIGATION: Clears history so user cannot click 'back' to return to Home
              navigation.reset({ 
                index: 0, 
                routes: [{ name: 'RoleSelection' }] 
              });
            } catch (error) {
              Alert.alert("Error", "Logout failed. Please try again.");
            }
          } 
        }
      ]
    );
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator color={K_GREEN} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={[
            styles.roleBadge, 
            role.toLowerCase() === 'farmer' ? { backgroundColor: '#e3f2fd' } : { backgroundColor: '#f0f9eb' }
          ]}>
            <Text style={[
              styles.roleText, 
              role.toLowerCase() === 'farmer' ? { color: '#2196f3' } : { color: K_GREEN }
            ]}>
              {role.toUpperCase()} ACCOUNT
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            placeholder="Search for a setting..." 
            style={styles.searchInput} 
            placeholderTextColor="#bbb" 
          />
        </View>

        <View style={styles.menuList}>
          {menuOptions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.target)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconWrapper, 
                role.toLowerCase() === 'farmer' && item.id === '1' ? { backgroundColor: '#e3f2fd' } : null
              ]}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={role.toLowerCase() === 'farmer' && item.id === '1' ? '#2196f3' : K_GREEN} 
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.id === '1' && (
                  <Text style={styles.subText}>Manage your {role.toLowerCase()} details</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ddd" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionDivider} />
        
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <View style={[styles.iconWrapper, {backgroundColor: '#fff5f5'}]}>
            <MaterialIcons name="logout" size={22} color="#dc3545" />
          </View>
          <Text style={[styles.menuText, {color: '#dc3545'}]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#fcc" />
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Kisan Marg v1.0.4</Text>
          <Text style={styles.madeInText}>Connecting Indian Farmers & Buyers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  roleText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f8f8', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 52, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eee'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: K_DARK_BLUE },
  menuList: { marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#fcfcfc' },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9eb', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textWrapper: { flex: 1 },
  menuText: { fontSize: 16, fontWeight: '600', color: K_DARK_BLUE },
  subText: { fontSize: 12, color: '#aaa', marginTop: 2 },
  sectionDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  footerInfo: { marginTop: 40, alignItems: 'center', paddingBottom: 30 },
  versionText: { color: '#ccc', fontSize: 12, fontWeight: 'bold' },
  madeInText: { color: '#eee', fontSize: 10, marginTop: 5 }
});