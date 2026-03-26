import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Orders({ navigation }) {
  const [activeTab, setActiveTab] = useState('Requests');

  // Dummy Data for Order Requests
  const orderRequests = [
    { 
      id: '1', 
      buyerName: 'Mr. Smruti Ranjan', 
      address: 'Plot 42, Mancheswar, Bhubaneswar', 
      product: 'Organic Potato',
      qty: '50kg',
      price: '₹3,500',
      image: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)'
    },
    { 
      id: '2', 
      buyerName: 'Mr. Partha Sarathi', 
      address: 'Lane 5, CDA Sector 10, Cuttack', 
      product: 'Red Tomato',
      qty: '20kg',
      price: '₹1,200',
      image: 'https://static.toiimg.com/thumb/imgsize-23456,msid-69972910,width-600,resizemode-4/69972910.jpg'
    },
  ];

  const renderOrderCard = ({ item }) => (
    <View style={styles.card}>
      {/* TOP INFO ROW */}
      <View style={styles.cardMain}>
        <View style={styles.infoCol}>
          <Text style={styles.buyerName}>{item.buyerName}</Text>
          <View style={styles.addressRow}>
             <Ionicons name="location-outline" size={14} color="#888" />
             <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
          </View>
          
          <View style={styles.detailsBox}>
             <Text style={styles.detailsText}>
               {item.product} <Text style={{color: '#ccc'}}>•</Text> {item.qty} <Text style={{color: '#ccc'}}>•</Text> <Text style={styles.priceHighlight}>{item.price}</Text>
             </Text>
          </View>
        </View>

        <Image source={{ uri: item.image }} style={styles.productThumbnail} />
      </View>

      {/* ACTION BUTTONS (Accept | Deny) */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={[styles.btnText, {color: K_GREEN}]}>Accept</Text>
        </TouchableOpacity>
        
        <View style={styles.verticalDivider} />

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={[styles.btnText, {color: '#dc3545'}]}>Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      {/* 2. TAB NAVIGATION */}
      <View style={styles.tabContainer}>
        {['Requests', 'Accepted', 'Completed'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. CONTENT */}
      {activeTab === 'Requests' ? (
        <FlatList
          data={orderRequests}
          keyExtractor={item => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="hourglass-outline" size={50} color="#ddd" />
          <Text style={styles.emptyText}>No {activeTab} orders yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  
  // TAB STYLES
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 15, 
    alignItems: 'center' 
  },
  activeTab: { borderBottomWidth: 3, borderBottomColor: K_DARK_BLUE },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: K_DARK_BLUE },

  // CARD STYLES
  listContainer: { padding: 15 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden'
  },
  cardMain: { flexDirection: 'row', padding: 18 },
  infoCol: { flex: 1, marginRight: 10 },
  buyerName: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addressText: { fontSize: 12, color: '#888', marginLeft: 4 },
  detailsBox: { 
    backgroundColor: '#f9f9f9', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  detailsText: { fontSize: 13, color: '#555', fontWeight: '500' },
  priceHighlight: { color: K_GREEN, fontWeight: 'bold' },
  productThumbnail: { width: 80, height: 80, borderRadius: 12 },

  // BUTTON STYLES
  actionRow: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0', 
    height: 50 
  },
  actionBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 15, fontWeight: 'bold' },
  verticalDivider: { width: 1, backgroundColor: '#f0f0f0' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#aaa', fontSize: 15 }
});