import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function PlaceOrder({ navigation, route }) {
  const { totalAmount } = route.params || { totalAmount: 0 };
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [showAddForm, setShowAddForm] = useState(false);
  
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

  const handleProceed = () => {
    const address = addresses.find(a => a.id === selectedAddress);
    navigation.navigate('Payment', { 
        totalAmount: totalAmount,
        deliveryAddress: address 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        {/* --- STEP INDICATOR --- */}
        <View style={styles.stepIndicator}>
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}>
                <Ionicons name="cart" size={16} color="#fff" />
            </View>
            <View style={[styles.stepLine, { backgroundColor: K_GREEN }]} />
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}>
                <Ionicons name="location" size={16} color="#fff" />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepCircle}>
                <Ionicons name="card" size={16} color="#ccc" />
            </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Delivery Address</Text>
            <Text style={styles.sectionSub}>Choose where you want your fresh harvest delivered</Text>
        </View>

        {/* --- ADDRESS LIST --- */}
        {addresses.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.addressCard, selectedAddress === item.id && styles.selectedCard]}
            onPress={() => setSelectedAddress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.addressHeader}>
                <View style={[styles.typeBadge, selectedAddress === item.id && { backgroundColor: K_GREEN }]}>
                    <Text style={[styles.typeText, selectedAddress === item.id && { color: '#fff' }]}>{item.type}</Text>
                </View>
                <Ionicons 
                    name={selectedAddress === item.id ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={selectedAddress === item.id ? K_GREEN : "#ccc"} 
                />
            </View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userPhone}>{item.phone}</Text>
            <Text style={styles.addressText}>{item.address}</Text>
          </TouchableOpacity>
        ))}

        {/* --- ADD NEW ADDRESS SECTION --- */}
        {!showAddForm ? (
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(true)}>
                <Ionicons name="add-circle" size={24} color={K_GREEN} />
                <Text style={styles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
        ) : (
            <View style={styles.newAddressForm}>
                <Text style={styles.formTitle}>New Delivery Details</Text>
                <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#bbb" />
                <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" placeholderTextColor="#bbb" />
                <TextInput placeholder="House No, Street Name" style={styles.input} placeholderTextColor="#bbb" />
                <TextInput placeholder="City & Pincode" style={styles.input} placeholderTextColor="#bbb" />
                
                <View style={styles.formActions}>
                    <TouchableOpacity onPress={() => setShowAddForm(false)} style={styles.cancelBtn}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => setShowAddForm(false)}>
                        <Text style={styles.saveBtnText}>Save Address</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}

      </ScrollView>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
        </View>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={handleProceed}
        >
            <Text style={styles.continueText}>PROCEED TO PAYMENT</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },

  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 25 },
  stepCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  stepLine: { width: 40, height: 2, backgroundColor: '#eee' },

  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  sectionSub: { fontSize: 13, color: '#888', marginTop: 4 },
  
  addressCard: { backgroundColor: '#fff', padding: 18, borderRadius: 25, marginBottom: 15, borderWidth: 1, borderColor: '#f0f0f0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  selectedCard: { borderColor: K_GREEN, backgroundColor: '#f9fff6' },
  
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  typeText: { fontSize: 11, fontWeight: 'bold', color: '#666' },
  
  userName: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE },
  userPhone: { fontSize: 14, color: K_GREEN, fontWeight: '600', marginVertical: 6 },
  addressText: { fontSize: 14, color: '#777', lineHeight: 22 },

  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', borderRadius: 25, marginTop: 10, backgroundColor: '#fff' },
  addBtnText: { marginLeft: 10, fontWeight: 'bold', color: K_GREEN, fontSize: 15 },

  newAddressForm: { backgroundColor: '#fff', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#eee', elevation: 5 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: K_DARK_BLUE },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#eee', color: K_DARK_BLUE },
  formActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cancelBtn: { padding: 10 },
  cancelBtnText: { color: '#999', fontWeight: 'bold' },
  saveBtn: { backgroundColor: K_DARK_BLUE, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },

  footer: { padding: 25, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', elevation: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { color: '#888', fontSize: 14 },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  continueBtn: { backgroundColor: K_GREEN, padding: 18, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 5 },
  continueText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 1, marginRight: 10 }
});