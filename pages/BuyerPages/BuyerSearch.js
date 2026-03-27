import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerSearch({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Data focused on what buyers look for
  const trendingItems = [
    { id: '1', name: 'Fresh Organic Potato', farm: 'Rajesh Farms', price: '₹30/kg' },
    { id: '2', name: 'Farm-Fresh Tomato', farm: 'Puri Organics', price: '₹45/kg' },
    { id: '3', name: 'Premium Basmati Rice', farm: 'Odisha Grains', price: '₹85/kg' },
    { id: '4', name: 'Dried Red Chilli', farm: 'Sambalpur Spices', price: '₹180/kg' },
  ];

  const recentSearches = ['Seedless Grapes', 'Organic Honey', 'Fresh Garlic', 'Local Onions'];

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vegetables, fruits, or farms..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            placeholderTextColor="#bbb"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. RECENT SEARCHES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.chipContainer}>
            {recentSearches.map((item, index) => (
              <TouchableOpacity key={index} style={styles.chip}>
                <Ionicons name="time-outline" size={14} color="#999" style={{marginRight: 5}} />
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. POPULAR HARVEST (Buyer's Trending) */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Trending Harvest</Text>
            <MaterialCommunityIcons name="fire" size={18} color="#f39c12" />
          </View>
          
          {trendingItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.trendItem}>
              <View style={styles.trendIcon}>
                <MaterialCommunityIcons name="basket-outline" size={20} color={K_GREEN} />
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.trendName}>{item.name}</Text>
                <Text style={styles.farmName}>{item.farm}</Text>
              </View>
              <Text style={styles.trendPrice}>{item.price}</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  searchHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  backBtn: { padding: 5, marginRight: 10 },
  searchBarContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f3f6', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    height: 45
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: K_DARK_BLUE },
  
  section: { padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginRight: 8 },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#eee', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    marginRight: 10, 
    marginBottom: 10 
  },
  chipText: { fontSize: 13, color: '#666' },
  
  trendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,
    elevation: 1
  },
  trendIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: '#f0f9eb', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  textColumn: { flex: 1 },
  trendName: { fontSize: 15, fontWeight: '600', color: K_DARK_BLUE },
  farmName: { fontSize: 12, color: '#999', marginTop: 2 },
  trendPrice: { fontSize: 14, fontWeight: 'bold', color: K_GREEN, marginRight: 10 },
});