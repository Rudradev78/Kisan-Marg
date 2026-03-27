import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 🟢 FIXED: Added Feather to the import list
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function SavedAddresses({ navigation }) {
  const [addresses, setAddresses] = useState([
    { 
      id: '1', 
      type: 'Home', 
      name: 'Smruti Ranjan', 
      phone: '+91 98765 43210', 
      address: 'Plot No. 42, Niladri Vihar, Chandrasekharpur, Bhubaneswar, 751021' 
    },
    { 
      id: '2', 
      type: 'Office', 
      name: 'Smruti Ranjan', 
      phone: '+91 88223 34455', 
      address: 'Kisan Tower, 4th Floor, Patia, Bhubaneswar, 751024' 
    },
  ]);

  const deleteAddress = (id) => {
    Alert.alert("Delete Address", "Are you sure you want to remove this location?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => setAddresses(addresses.filter(a => a.id !== id)) 
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
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity 
          style={styles.addHeaderBtn} 
          onPress={() => navigation.navigate('PlaceOrder')}
        >
          <Ionicons name="add" size={28} color={K_GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <View key={item.id} style={styles.addressCard}>
              <View style={styles.cardTop}>
                <View style={styles.typeBadge}>
                  <MaterialCommunityIcons 
                    name={item.type === 'Home' ? 'home-variant' : 'office-building'} 
                    size={12} 
                    color={K_GREEN} 
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => {}} style={styles.actionIcon}>
                    <Feather name="edit-2" size={18} color={K_DARK_BLUE} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAddress(item.id)} style={styles.actionIcon}>
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
              
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={14} color="#aaa" />
                <Text style={styles.phoneText}>{item.phone}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color="#eee" />
            <Text style={styles.emptyText}>No addresses saved yet.</Text>
          </View>
        )}
      </ScrollView>

      {/* --- FLOATING ADD BUTTON --- */}
      <TouchableOpacity 
        style={styles.floatingAddBtn} 
        onPress={() => navigation.navigate('PlaceOrder')}
      >
        <Ionicons name="add" size={30} color="#fff" />
        <Text style={styles.floatingBtnText}>Add New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  addHeaderBtn: { padding: 5 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  addressCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  cardTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  typeBadge: { 
    flexDirection: 'row',
    backgroundColor: '#f0f9eb', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8,
    alignItems: 'center'
  },
  typeText: { fontSize: 10, fontWeight: 'bold', color: K_GREEN, letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 20, padding: 5 },
  
  userName: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE },
  addressText: { 
    fontSize: 14, 
    color: '#777', 
    marginTop: 8, 
    lineHeight: 22,
    letterSpacing: 0.3
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  phoneText: { fontSize: 14, color: K_DARK_BLUE, fontWeight: '600', marginLeft: 8 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#ccc', fontSize: 16, marginTop: 15, fontWeight: '500' },

  floatingAddBtn: { 
    position: 'absolute', 
    bottom: 30, 
    right: 20, 
    backgroundColor: K_GREEN, 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 30,
    elevation: 5,
    shadowColor: K_GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  floatingBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }
});