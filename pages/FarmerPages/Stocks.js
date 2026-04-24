import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, 
  Dimensions, Modal, TextInput, Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/api';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Stocks({ navigation }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await apiClient.get('/products/farmer');
      setStocks(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (product) => {
    setSelectedProduct({ ...product });
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Product", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await apiClient.delete(`/products/${id}`);
          setModalVisible(false);
          fetchStocks();
        } catch (error) {
          Alert.alert("Error", "Could not delete product");
        }
      }}
    ]);
  };

  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      await apiClient.put(`/products/${selectedProduct._id}`, {
        productName: selectedProduct.productName,
        pricePerUnit: selectedProduct.pricePerUnit,
        availableQuantity: selectedProduct.availableQuantity,
      });
      Alert.alert("Success", "Product updated");
      setIsEditing(false);
      fetchStocks();
    } catch (error) {
      Alert.alert("Error", "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const renderStockCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetails(item)}>
      <View style={styles.mainInfo}>
        <View style={styles.leftCol}>
          <Text style={styles.productName}>{item.productName}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{item.pricePerUnit}/{item.unitGiven}</Text>
            <Text style={styles.availableText}>{item.availableQuantity}{item.unitGiven} left</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>{item.noOfOrders} orders</Text>
            <View style={styles.ratingBox}>
               <Text style={styles.ratingText}>{item.rating}</Text>
               <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          </View>
        </View>
        <Image source={{ uri: item.productImageURL }} style={styles.productImg} />
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={18} color="#dc3545" />
          <Text style={[styles.btnText, {color: '#dc3545'}]}> Delete</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={() => openDetails(item)}>
          <Ionicons name="create-outline" size={18} color={K_DARK_BLUE} />
          <Text style={[styles.btnText, {color: K_DARK_BLUE}]}> Details / Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory (Stocks)</Text>
        <TouchableOpacity onPress={() => fetchStocks()}>
          <Ionicons name="refresh" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={K_GREEN} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={item => item._id}
          renderItem={renderStockCard}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={<Text style={styles.emptyText}>No products listed yet.</Text>}
        />
      )}

      {/* --- PRODUCT DETAILS MODAL --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#ccc" />
              </TouchableOpacity>

              {selectedProduct && (
                <>
                  <Image source={{ uri: selectedProduct.productImageURL }} style={styles.modalImg} />
                  
                  <Text style={styles.modalLabel}>Product Name</Text>
                  <TextInput 
                    style={[styles.modalInput, !isEditing && styles.disabledInput]}
                    editable={isEditing}
                    value={selectedProduct.productName}
                    onChangeText={(txt) => setSelectedProduct({...selectedProduct, productName: txt})}
                  />

                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                      <Text style={styles.modalLabel}>Price (₹)</Text>
                      <TextInput 
                        style={[styles.modalInput, !isEditing && styles.disabledInput]}
                        editable={isEditing}
                        keyboardType="numeric"
                        value={selectedProduct.pricePerUnit.toString()}
                        onChangeText={(txt) => setSelectedProduct({...selectedProduct, pricePerUnit: txt})}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.modalLabel}>Quantity Left</Text>
                      <TextInput 
                        style={[styles.modalInput, !isEditing && styles.disabledInput]}
                        editable={isEditing}
                        keyboardType="numeric"
                        value={selectedProduct.availableQuantity.toString()}
                        onChangeText={(txt) => setSelectedProduct({...selectedProduct, availableQuantity: txt})}
                      />
                    </View>
                  </View>

                  <View style={styles.modalActionRow}>
                    {isEditing ? (
                      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                        {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                        <Ionicons name="pencil" size={20} color="#fff" />
                        <Text style={styles.saveBtnText}> Edit Product</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(selectedProduct._id)}>
                      <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UploadProduct')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  listPadding: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, elevation: 4, overflow: 'hidden' },
  mainInfo: { flexDirection: 'row', padding: 20 },
  leftCol: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: K_GREEN, marginRight: 15 },
  availableText: { fontSize: 12, color: '#666' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888', marginRight: 15 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', marginRight: 2 },
  productImg: { width: 80, height: 80, borderRadius: 12 },
  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', height: 50 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 13 },
  verticalDivider: { width: 1, backgroundColor: '#f0f0f0' },
  fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: K_GREEN, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#aaa' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: height * 0.8 },
  closeModal: { alignSelf: 'flex-end', marginBottom: 10 },
  modalImg: { width: '100%', height: 200, borderRadius: 20, marginBottom: 20 },
  modalLabel: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 5, marginTop: 15 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, color: K_DARK_BLUE },
  disabledInput: { backgroundColor: '#f9f9f9', color: '#999', borderColor: '#eee' },
  modalActionRow: { flexDirection: 'row', marginTop: 30, marginBottom: 20 },
  editBtn: { flex: 1, backgroundColor: K_DARK_BLUE, height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  saveBtn: { flex: 1, backgroundColor: K_GREEN, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  deleteBtn: { backgroundColor: '#dc3545', width: 55, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});