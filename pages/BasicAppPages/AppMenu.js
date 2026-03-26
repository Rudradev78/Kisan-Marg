import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function AppMenu({ navigation }) {
  
  const menuOptions = [
    { id: '1', title: 'Profile', icon: 'person-outline', target: 'FarmerProfile' },
    { id: '2', title: 'Language', icon: 'language-outline', target: 'Language' },
    { id: '3', title: 'About App', icon: 'information-circle-outline', target: 'AboutApp' },
    { id: '4', title: 'Help & Contact', icon: 'help-circle-outline', target: 'HelpContact' },
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput placeholder="Search for a setting..." style={styles.searchInput} placeholderTextColor="#999" />
        </View>

        <View style={styles.menuList}>
          {menuOptions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.target)}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={22} color={K_DARK_BLUE} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutWrapper}>
            <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                <View style={[styles.iconWrapper, {backgroundColor: '#fff5f5'}]}>
                    <MaterialIcons name="logout" size={22} color="#dc3545" />
                </View>
                <Text style={[styles.menuText, {color: '#dc3545'}]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color="#fcc" />
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f6', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 30 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: K_DARK_BLUE },
  menuList: { marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  iconWrapper: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: K_DARK_BLUE },
  logoutWrapper: { marginTop: 10 },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
});