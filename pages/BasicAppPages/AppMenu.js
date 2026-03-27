import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function AppMenu({ navigation, route }) {
  // 🟢 LOGIC: Extract role. Default to 'buyer' only if absolutely nothing is passed.
  const { userRole } = route.params || { userRole: 'buyer' };

  // 🟢 DYNAMIC MENU: We define this INSIDE the component so it knows the userRole
  const menuOptions = [
    { 
      id: '1', 
      title: 'Profile', 
      icon: 'person-outline', 
      // Navigates to the correct profile based on role
      target: userRole === 'farmer' ? 'FarmerProfile' : 'BuyerProfile' 
    },
    { id: '2', title: 'Language', icon: 'language-outline', target: 'Language' },
    { id: '3', title: 'About Kisan Marg', icon: 'leaf-outline', target: 'AboutApp' },
    { id: '4', title: 'Help & Contact', icon: 'headset-outline', target: 'HelpContact' },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] }) 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Settings</Text>
          {/* 🟢 DYNAMIC BADGE: Changes color and text based on role */}
          <View style={[
            styles.roleBadge, 
            userRole === 'farmer' ? { backgroundColor: '#e3f2fd' } : { backgroundColor: '#f0f9eb' }
          ]}>
            <Text style={[
              styles.roleText, 
              userRole === 'farmer' ? { color: '#2196f3' } : { color: K_GREEN }
            ]}>
              {userRole.toUpperCase()} ACCOUNT
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- SEARCH --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            placeholder="Search for a setting..." 
            style={styles.searchInput} 
            placeholderTextColor="#bbb" 
          />
        </View>

        {/* --- MENU LIST --- */}
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
                userRole === 'farmer' && item.id === '1' ? { backgroundColor: '#e3f2fd' } : null
              ]}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={userRole === 'farmer' && item.id === '1' ? '#2196f3' : K_GREEN} 
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.id === '1' && (
                  <Text style={styles.subText}>Manage your {userRole} details</Text>
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
  roleBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6, 
    marginTop: 2
  },
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
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#fcfcfc' 
  },
  iconWrapper: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: '#f0f9eb', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  textWrapper: { flex: 1 },
  menuText: { fontSize: 16, fontWeight: '600', color: K_DARK_BLUE },
  subText: { fontSize: 12, color: '#aaa', marginTop: 2 },
  sectionDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  footerInfo: { marginTop: 40, alignItems: 'center', paddingBottom: 30 },
  versionText: { color: '#ccc', fontSize: 12, fontWeight: 'bold' },
  madeInText: { color: '#eee', fontSize: 10, marginTop: 5 }
});