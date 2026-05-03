import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  Modal, Dimensions, Alert, Image, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot'; 
import * as Sharing from 'expo-sharing'; 
import * as MediaLibrary from 'expo-media-library'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerHistory({ navigation }) {
  const [user, setUser] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, ordersDone: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const viewShotRef = useRef();

  // Load user data and fetch history on focus
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) setUser(JSON.parse(storedUser));
      fetchHistory();
    } catch (e) { console.log(e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/orders/farmer/history');
      if (res.data.success) {
        setHistoryData(res.data.data);
        setStats(res.data.stats || { totalSales: 0, ordersDone: 0 });
      }
    } catch (err) {
      console.log("History Fetch Error:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // --- IMAGE CAPTURE LOGIC (Fixed for Android 13+) ---
  const handleCaptureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) { Alert.alert("Error", "Could not share receipt."); }
  };

  const handleCaptureAndSave = async () => {
    try {
      // Pass 'true' for write-only permission to avoid audio permission rejection
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status === 'granted') {
        const uri = await viewShotRef.current.capture();
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("KisanMarg_Sales", asset, false);
        Alert.alert("Saved ✅", "Sale receipt saved to gallery!");
      } else {
        Alert.alert("Permission Denied", "Gallery access is needed to save bills.");
      }
    } catch (error) { 
      console.log(error);
      Alert.alert("Error", "Failed to save. Check storage permissions."); 
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.idBadge}><Text style={styles.idText}>#SAL-{item._id.slice(-6).toUpperCase()}</Text></View>
        <Text style={styles.dateText}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.product?.productImageURL }} style={{width: 40, height: 40, borderRadius: 8, marginRight: 12}} />
          <View>
            <Text style={styles.buyerNameList}>{item.buyerId?.name || "Customer"}</Text>
            <Text style={styles.itemDetails}>{item.product?.productName} • {item.quantity}kg</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.totalAmount}>₹{item.totalPrice}</Text>
          <Text style={[styles.statusText, { color: item.status === 'Completed' ? K_GREEN : '#dc3545' }]}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.detailsLink} onPress={() => handleViewReceipt(item)}>
        <Text style={styles.linkText}>View Full Receipt</Text>
        <Ionicons name="chevron-forward" size={14} color={K_GREEN} />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE}/></TouchableOpacity>
        <Text style={styles.headerTitle}>Sales History</Text>
        <TouchableOpacity onPress={onRefresh}><Ionicons name="refresh" size={22} color={K_DARK_BLUE}/></TouchableOpacity>
      </View>

      <LinearGradient colors={[K_DARK_BLUE, '#1a3a6d']} style={styles.summaryCard} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Sales</Text><Text style={styles.summaryValue}>₹{stats.totalSales}</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Orders Done</Text><Text style={styles.summaryValue}>{stats.ordersDone}</Text></View>
      </LinearGradient>

      <FlatList
        data={historyData}
        keyExtractor={item => item._id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={<Text style={styles.listTitle}>Completed Transactions</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No sales history found.</Text>}
      />

      {/* --- SALE RECEIPT MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sale Receipt</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close-circle" size={30} color="#ddd" /></TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }} style={{ backgroundColor: '#fff' }}>
                  <View style={styles.receiptDetails}>
                    <View style={styles.receiptHeaderRow}>
                      <View style={{flex: 1}}>
                        <Text style={styles.sellerLabel}>SELLER / PRODUCER</Text>
                        <Text style={styles.sellerName}>{user?.name}</Text>
                        <Text style={styles.addressValSmall}>{user?.location}</Text>
                        <Text style={styles.addressValSmall}>Verified Kisan Marg Partner</Text>
                      </View>
                      <Image source={require('../../assets/App-logo-only-no-bg.png')} style={styles.receiptLogo} />
                    </View>

                    <View style={styles.receiptIDRow}>
                       <Text style={styles.receiptLabel}>Sale ID</Text>
                       <Text style={styles.receiptValue}>#KM-SAL-{selectedOrder._id.slice(-6).toUpperCase()}</Text>
                    </View>

                    <View style={styles.receiptDivider} />

                    <View style={styles.receiptInfoGrid}>
                      <View style={styles.infoGroupFull}>
                        <Text style={styles.infoLabel}>CUSTOMER DETAILS</Text>
                        <Text style={styles.infoVal}>{selectedOrder.buyerId?.name || "Customer"}</Text>
                        <Text style={styles.addressValSmall}>{selectedOrder.buyerId?.location || "Address not provided"}</Text>
                        <Text style={styles.addressValSmall}>Ph: {selectedOrder.buyerId?.phno || "N/A"}</Text>
                      </View>
                      
                      <View style={styles.infoGroup}><Text style={styles.infoLabel}>DATE</Text><Text style={styles.infoVal}>{new Date(selectedOrder.updatedAt).toLocaleDateString()}</Text></View>
                      <View style={styles.infoGroup}><Text style={styles.infoLabel}>PRODUCT</Text><Text style={styles.infoVal}>{selectedOrder.product?.productName}</Text></View>
                      <View style={styles.infoGroup}><Text style={styles.infoLabel}>QUANTITY</Text><Text style={styles.infoVal}>{selectedOrder.quantity}kg</Text></View>
                      <View style={styles.infoGroup}><Text style={styles.infoLabel}>METHOD</Text><Text style={styles.infoVal}>{selectedOrder.transactionId === 'COD' ? 'Cash' : 'Online'}</Text></View>
                      
                      <View style={styles.infoGroupFull}>
                        <Text style={styles.infoLabel}>TRANSACTION ID</Text>
                        <Text style={styles.infoVal}>{selectedOrder.transactionId || "N/A"}</Text>
                      </View>
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total Revenue</Text>
                      <Text style={styles.totalValue}>₹{selectedOrder.totalPrice}</Text>
                    </View>
                    <Text style={styles.receiptFooterText}>Digitally Generated • Kisan Marg Agriculture Network</Text>
                  </View>
                </ViewShot>

                <View style={styles.modalActionRow}>
                  <TouchableOpacity style={styles.downloadBtn} onPress={handleCaptureAndSave}>
                    <Ionicons name="download-outline" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}> Save Bill</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareBtn} onPress={handleCaptureAndShare}>
                    <Ionicons name="share-social-outline" size={20} color={K_GREEN} />
                    <Text style={[styles.actionBtnText, {color: K_GREEN}]}> Share</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  summaryCard: { margin: 20, padding: 25, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 10 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 5 },
  summaryValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  historyCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f9f9f9', paddingBottom: 8 },
  idBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  idText: { fontSize: 11, fontWeight: 'bold', color: '#888' },
  dateText: { fontSize: 12, color: '#aaa' },
  buyerNameList: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  itemDetails: { fontSize: 13, color: '#666', marginTop: 2 },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  statusText: { fontSize: 11, fontWeight: 'bold', marginTop: 3 },
  detailsLink: { marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f9f9f9' },
  linkText: { fontSize: 13, color: K_GREEN, fontWeight: '600', marginRight: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: height * 0.8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  modalBody: { flex: 1 },
  
  receiptViewshotContainer: { backgroundColor: '#fff', padding: 5, borderRadius: 20 },
  receiptDetails: { padding: 15, borderWidth: 1.5, borderColor: '#eee', borderStyle: 'dashed', borderRadius: 20, backgroundColor: '#fff' },
  
  receiptHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  sellerLabel: { fontSize: 9, color: '#aaa', letterSpacing: 1, fontWeight: 'bold' },
  sellerName: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 2 },
  addressValSmall: { fontSize: 11, color: '#666', marginTop: 2, lineHeight: 15 },
  receiptLogo: { width: 40, height: 40, opacity: 0.8 },

  receiptIDRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  receiptLabel: { color: '#888', fontSize: 12 },
  receiptValue: { fontWeight: '700', color: K_DARK_BLUE, fontSize: 12 },
  receiptDivider: { height: 1, backgroundColor: '#eee', marginBottom: 15 },
  
  receiptInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoGroupFull: { width: '100%', marginBottom: 15 },
  infoGroup: { width: '48%', marginBottom: 15 },
  infoLabel: { fontSize: 9, color: '#aaa', letterSpacing: 1, marginBottom: 4, fontWeight: 'bold' },
  infoVal:  { fontSize: 14, fontWeight: 'bold', color: K_DARK_BLUE },
  
  totalRow: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: K_GREEN },
  receiptFooterText: { textAlign: 'center', fontSize: 9, color: '#ccc', marginTop: 15, fontStyle: 'italic' },
  
  modalActionRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  downloadBtn: { backgroundColor: K_DARK_BLUE, flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  shareBtn: { backgroundColor: '#fff', flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: K_GREEN },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});