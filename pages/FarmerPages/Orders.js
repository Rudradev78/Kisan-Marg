import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, 
  Dimensions, Alert, ActivityIndicator, Modal, Share 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/api';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Orders({ navigation }) {
  const [activeTab, setActiveTab] = useState('Requests');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/orders/farmer');
      setOrders(res.data.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) { Alert.alert("Error", "Update failed"); }
  };

  const handleDeny = (id) => {
    Alert.alert("Deny Order", "Are you sure you want to reject this request?", [
      { text: "No" },
      { text: "Yes, Deny", onPress: async () => {
        await apiClient.delete(`/orders/${id}`);
        fetchOrders();
      }}
    ]);
  };

  const handleShareReceipt = async (order) => {
    const message = `Kisan Marg Receipt\nOrder ID: ${order._id}\nBuyer: ${order.buyerId.name}\nProduct: ${order.product.productName}\nTotal: ₹${order.totalPrice}`;
    await Share.share({ message });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Requests') return order.status === 'Requested';
    if (activeTab === 'Accepted') return ['Accepted', 'Packed', 'Out for Delivery'].includes(order.status);
    if (activeTab === 'Completed') return ['Completed', 'Cancelled'].includes(order.status);
  });

  const renderOrderCard = ({ item }) => (
    <View style={styles.card}>
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
        <Image source={{ uri: item.product?.productImageURL }} style={styles.productThumbnail} />
      </View>

      <View style={styles.actionRow}>
        {activeTab === 'Requests' && (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Accepted')}>
              <Text style={[styles.btnText, {color: K_GREEN}]}>Accept</Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeny(item._id)}>
              <Text style={[styles.btnText, {color: '#dc3545'}]}>Deny</Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'Accepted' && (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Packed')}>
              <Text style={[styles.btnText, {color: item.status === 'Packed' ? '#aaa' : K_DARK_BLUE}]}>Packed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Out for Delivery')}>
              <Text style={[styles.btnText, {color: item.status === 'Out for Delivery' ? '#aaa' : K_DARK_BLUE}]}>Out for Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item._id, 'Completed')}>
              <Text style={[styles.btnText, {color: K_GREEN}]}>Delivered</Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'Completed' && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelectedOrder(item); setModalVisible(true); }}>
            <Ionicons name="receipt-outline" size={18} color={K_DARK_BLUE} />
            <Text style={[styles.btnText, {color: K_DARK_BLUE, marginLeft: 5}]}>View Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE}/></TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity onPress={fetchOrders}><Ionicons name="refresh" size={24} color={K_DARK_BLUE}/></TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['Requests', 'Accepted', 'Completed'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator size="large" color={K_GREEN} style={{marginTop: 50}}/> : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item._id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No {activeTab} orders.</Text>}
        />
      )}

      {/* RECEIPT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Receipt</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={28}/></TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <View style={styles.receiptBody}>
                <View style={styles.receiptRow}><Text>Product:</Text><Text style={{fontWeight:'bold'}}>{selectedOrder.product.productName}</Text></View>
                <View style={styles.receiptRow}><Text>Quantity:</Text><Text>{selectedOrder.quantity}kg</Text></View>
                <View style={styles.receiptRow}><Text>Price:</Text><Text>₹{selectedOrder.totalPrice}</Text></View>
                <View style={styles.receiptRow}><Text>Status:</Text><Text style={{color: K_GREEN}}>{selectedOrder.status}</Text></View>
                
                <TouchableOpacity style={styles.shareButton} onPress={() => handleShareReceipt(selectedOrder)}>
                  <Text style={styles.shareText}>Download & Share Receipt</Text>
                </TouchableOpacity>
              </View>
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: K_DARK_BLUE },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: K_DARK_BLUE },
  listContainer: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, elevation: 3, overflow: 'hidden' },
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
  btnText: { fontSize: 12, fontWeight: 'bold' },
  verticalDivider: { width: 1, backgroundColor: '#f0f0f0' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#aaa' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  receiptBody: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  shareButton: { backgroundColor: K_DARK_BLUE, marginTop: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: 'bold' }
});