import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Payment({ navigation, route }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  
  // 🟢 LOGIC: Receive dynamic total from Kart/PlaceOrder
  const { totalAmount } = route.params || { totalAmount: 0 }; 

  const paymentMethods = [
    { id: 'upi', title: 'UPI (GPay, PhonePe, BHIM)', icon: 'qrcode', provider: 'MaterialCommunityIcons' },
    { id: 'card', title: 'Credit / Debit Card', icon: 'card', provider: 'Ionicons' },
    { id: 'netbanking', title: 'Net Banking', icon: 'bank', provider: 'MaterialCommunityIcons' },
    { id: 'cod', title: 'Cash on Delivery', icon: 'hand-holding-usd', provider: 'FontAwesome5' },
  ];

  const handlePayment = () => {
    const newOrder = {
      id: 'KM-' + Math.floor(Math.random() * 1000000), 
      name: 'Organic Potato', 
      price: totalAmount,
      status: 'Processing',
      date: 'Ordered on ' + new Date().toLocaleDateString(),
      img: 'https://www.jiomart.com/images/product/original/590002402/potato-3-kg-product-images-o590002402-p613131749-0-202512111622.jpg?im=Resize=(1000,1000)',
      qty: 1, 
      farmer: 'Rajesh Farms'
    };
    if (selectedMethod === 'cod') {
      navigation.navigate('OrderSuccess');
    } else {
      Alert.alert("Razorpay Integration", "This will trigger the Razorpay SDK for the amount of ₹" + totalAmount);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        {/* --- STEP INDICATOR --- */}
        <View style={styles.stepIndicator}>
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}><Ionicons name="cart" size={16} color="#fff" /></View>
            <View style={[styles.stepLine, { backgroundColor: K_GREEN }]} />
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}><Ionicons name="location" size={16} color="#fff" /></View>
            <View style={[styles.stepLine, { backgroundColor: K_GREEN }]} />
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}><Ionicons name="card" size={16} color="#fff" /></View>
        </View>

        {/* --- TOTAL AMOUNT CARD --- */}
        <LinearGradient colors={[K_DARK_BLUE, '#1c3a6e']} style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>₹{totalAmount}.00</Text>
            <View style={styles.secureBadge}>
                <Ionicons name="shield-checkmark" size={14} color={K_GREEN} />
                <Text style={styles.secureText}>100% Secure SSL Encryption</Text>
            </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {paymentMethods.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.methodCard, selectedMethod === item.id && styles.selectedCard]}
            onPress={() => setSelectedMethod(item.id)}
          >
            <View style={styles.methodIconBox}>
                {item.provider === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={24} color={selectedMethod === item.id ? K_GREEN : '#888'} />}
                {item.provider === 'Ionicons' && <Ionicons name={item.icon} size={24} color={selectedMethod === item.id ? K_GREEN : '#888'} />}
                {item.provider === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={20} color={selectedMethod === item.id ? K_GREEN : '#888'} />}
            </View>
            
            <Text style={[styles.methodTitle, selectedMethod === item.id && { color: K_DARK_BLUE, fontWeight: 'bold' }]}>
                {item.title}
            </Text>

            <Ionicons 
                name={selectedMethod === item.id ? "checkmark-circle" : "ellipse-outline"} 
                size={22} 
                color={selectedMethod === item.id ? K_GREEN : "#eee"} 
            />
          </TouchableOpacity>
        ))}

        {selectedMethod === 'upi' && (
            <View style={styles.upiApps}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png' }} style={styles.upiLogo} resizeMode="contain" />
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png' }} style={styles.upiLogo} resizeMode="contain" />
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png' }} style={styles.upiLogo} resizeMode="contain" />
            </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>
            {selectedMethod === 'cod' ? 'PLACE ORDER' : 'PAY SECURELY'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  stepCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  stepLine: { width: 40, height: 2, backgroundColor: '#eee' },
  amountCard: { padding: 25, borderRadius: 25, alignItems: 'center', marginBottom: 30, elevation: 5 },
  amountLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  amountValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 5, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  secureText: { color: '#fff', fontSize: 10, marginLeft: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  selectedCard: { borderColor: K_GREEN, backgroundColor: '#fafff9' },
  methodIconBox: { width: 45, alignItems: 'center' },
  methodTitle: { flex: 1, fontSize: 15, color: '#666', marginLeft: 10 },
  upiApps: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, opacity: 0.6 },
  upiLogo: { width: 40, height: 20, marginHorizontal: 15 },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  payBtn: { backgroundColor: K_GREEN, padding: 18, borderRadius: 18, alignItems: 'center', elevation: 4 },
  payBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 }
});