import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Alert, StatusBar, ActivityIndicator, Modal, TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../services/api';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function SavedAddresses({ navigation }) {
  const [addresses, setAddresses] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [addressId, setAddressId] = useState(null);
  const [type, setType] = useState('Home');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      const res = await apiClient.get('/auth/stats');
      setAddresses(res.data.user.addresses || []);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setAddressId(item._id);
      setType(item.type);
      setName(item.name);
      setPhone(item.phone);
      setFullAddress(item.address);
    } else {
      setAddressId(null);
      setType('Home');
      setName('');
      setPhone('');
      setFullAddress('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !phone || !fullAddress) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      // Re-using profile update logic to handle nested address array
      const res = await apiClient.put('/auth/profile', {
        addressUpdate: { addressId, type, name, phone, address: fullAddress }
      });
      if (res.data.success) {
        setAddresses(res.data.data.addresses);
        setModalVisible(false);
        Alert.alert("Success", "Address saved!");
      }
    } catch (err) {
      Alert.alert("Error", "Could not save address");
    }
  };

  const deleteAddress = (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            const res = await apiClient.delete(`/auth/address/${id}`);
            setAddresses(res.data.data);
          } catch (err) { Alert.alert("Error", "Failed to delete"); }
        } 
      }
    ]);
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity onPress={() => openModal()}><Ionicons name="add" size={28} color={K_GREEN} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Safety check with optional chaining */}
        {addresses?.length > 0 ? (
          addresses.map((item) => (
            <View key={item._id} style={styles.addressCard}>
              <View style={styles.cardTop}>
                <View style={styles.typeBadge}>
                  <MaterialCommunityIcons name={item.type === 'Home' ? 'home-variant' : 'office-building'} size={12} color={K_GREEN} style={{ marginRight: 4 }} />
                  <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => openModal(item)} style={styles.actionIcon}><Feather name="edit-2" size={18} color={K_DARK_BLUE} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAddress(item._id)} style={styles.actionIcon}><Ionicons name="trash-outline" size={18} color="#e74c3c" /></TouchableOpacity>
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
          <View style={styles.emptyContainer}><Ionicons name="location-outline" size={80} color="#eee" /><Text style={styles.emptyText}>No addresses saved yet.</Text></View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddBtn} onPress={() => openModal()}>
        <Ionicons name="add" size={30} color="#fff" /><Text style={styles.floatingBtnText}>Add New</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{addressId ? "Edit Address" : "New Address"}</Text>
            <View style={styles.typeRow}>
              {['Home', 'Office', 'Other'].map((t) => (
                <TouchableOpacity key={t} style={[styles.typeChip, type === t && styles.activeChip]} onPress={() => setType(t)}>
                  <Text style={[styles.typeChipText, type === t && styles.activeChipText]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Receiver's Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput style={[styles.input, {height: 80}]} placeholder="Full Address" value={fullAddress} onChangeText={setFullAddress} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={{color:'#fff', fontWeight:'bold'}}>Save Address</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  scrollContent: { padding: 20, paddingBottom: 100 },
  addressCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  typeBadge: { flexDirection: 'row', backgroundColor: '#f0f9eb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignItems: 'center' },
  typeText: { fontSize: 10, fontWeight: 'bold', color: K_GREEN },
  cardActions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 20, padding: 5 },
  userName: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE },
  addressText: { fontSize: 14, color: '#777', marginTop: 8, lineHeight: 22 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  phoneText: { fontSize: 14, color: K_DARK_BLUE, fontWeight: '600', marginLeft: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#ccc', fontSize: 16, marginTop: 15 },
  floatingAddBtn: { position: 'absolute', bottom: 30, right: 20, backgroundColor: K_GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, elevation: 5 },
  floatingBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 20 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 15 },
  typeRow: { flexDirection: 'row', marginBottom: 20 },
  typeChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginRight: 10 },
  activeChip: { backgroundColor: K_GREEN, borderColor: K_GREEN },
  typeChipText: { color: '#888' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { padding: 15, width: '45%', alignItems: 'center' },
  saveBtn: { backgroundColor: K_DARK_BLUE, padding: 15, borderRadius: 12, width: '45%', alignItems: 'center' }
});