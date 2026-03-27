import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Kart({ navigation, route }) {
  const { cartData } = route.params || { cartData: [] };
  const [cartItems, setCartItems] = useState(cartData);

  useEffect(() => {
    if (route.params?.cartData) {
      setCartItems(route.params.cartData);
    }
  }, [route.params?.cartData]);

  const updateQty = (id, action) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = action === 'plus' ? item.qty + 1 : item.qty - 1;
          return { ...item, qty: Math.max(1, newQty) }; 
        }
        return item;
      })
    );
  };

  const removeItem = (id, name) => {
    Alert.alert(
      "Remove Item",
      `Remove ${name} from your kart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => {
          setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        }}
      ]
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.cardTopSection}>
        <TouchableOpacity 
            style={styles.cardInfoArea} 
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image source={{ uri: item.img }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
                <View style={styles.farmerBadge}>
                    <Text style={styles.badgeText}>{item.farmer}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.itemWeight}>{item.weight}</Text>
                </View>
            </View>
        </TouchableOpacity>

        <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 'minus')}>
                <Feather name="minus" size={16} color={item.qty > 1 ? K_DARK_BLUE : "#ccc"} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 'plus')}>
                <Feather name="plus" size={16} color={K_GREEN} />
            </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeBtnDashed} 
        onPress={() => removeItem(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={16} color="#e74c3c" />
        <Text style={styles.removeBtnText}>Remove from Kart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Kart</Text>
        <TouchableOpacity 
          onPress={() => cartItems.length > 0 && Alert.alert("Clear Kart", "Empty your entire kart?", [{text: "No"}, {text: "Yes", onPress: () => setCartItems([])}])}
        >
            <Ionicons 
              name="trash-bin-outline" 
              size={22} 
              color={cartItems.length > 0 ? "#e74c3c" : "#ccc"} 
            />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => cartItems.length > 0 ? (
          <View style={styles.stepIndicator}>
            <View style={[styles.stepCircle, { backgroundColor: K_GREEN }]}><Ionicons name="cart" size={16} color="#fff" /></View>
            <View style={styles.stepLine} />
            <View style={styles.stepCircle}><Ionicons name="location" size={16} color="#ccc" /></View>
            <View style={styles.stepLine} />
            <View style={styles.stepCircle}><Ionicons name="card" size={16} color="#ccc" /></View>
          </View>
        ) : null}
        ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="cart-off" size={80} color="#ddd" />
                <Text style={styles.emptyText}>Your kart is empty</Text>
                <TouchableOpacity style={styles.shopNow} onPress={() => navigation.navigate('BuyerHome')}>
                    <Text style={styles.shopNowText}>Shop Fresh Produce</Text>
                </TouchableOpacity>
            </View>
        )}
      />

      {/* --- BILLING FOOTER --- */}
      {cartItems.length > 0 ? (
        <View style={styles.footer}>
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal ({cartItems.length} items)</Text>
                <Text style={styles.billTotal}>₹{subtotal}</Text>
            </View>
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billTotal}>₹{deliveryFee}</Text>
            </View>
            
            <View style={styles.grandTotalContainer}>
                <View>
                    <Text style={styles.grandLabel}>GRAND TOTAL</Text>
                    <Text style={styles.grandValue}>₹{total}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.placeOrderBtn}
                    onPress={() => navigation.navigate('PlaceOrder', { totalAmount: total })}
                >
                    <Text style={styles.placeOrderText}>PLACE ORDER</Text>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  stepLine: { width: 40, height: 2, backgroundColor: '#f0f0f0', marginHorizontal: 5 },
  cartCard: { backgroundColor: '#fff', borderRadius: 25, padding: 15, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginHorizontal: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  cardTopSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardInfoArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemImg: { width: 85, height: 85, borderRadius: 20 },
  itemInfo: { flex: 1, marginLeft: 15 },
  farmerBadge: { backgroundColor: '#f0f9eb', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 5 },
  badgeText: { fontSize: 10, color: K_GREEN, fontWeight: 'bold' },
  itemName: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  itemPrice: { fontSize: 18, fontWeight: 'bold', color: K_GREEN },
  dot: { marginHorizontal: 8, color: '#ddd' },
  itemWeight: { fontSize: 13, color: '#999' },
  qtyContainer: { backgroundColor: '#f9f9f9', borderRadius: 15, padding: 5, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  qtyBtn: { padding: 6 },
  qtyText: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginVertical: 2 },
  removeBtnDashed: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#efcaca', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 10, backgroundColor: '#fffaf9' },
  removeBtnText: { color: '#e74c3c', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  footer: { backgroundColor: '#fff', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billLabel: { fontSize: 14, color: '#777' },
  billTotal: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  grandTotalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  grandLabel: { fontSize: 12, color: '#999', letterSpacing: 1 },
  grandValue: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE },
  placeOrderBtn: { backgroundColor: K_GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 20, elevation: 5 },
  placeOrderText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginRight: 10 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#ccc', marginTop: 15 },
  shopNow: { marginTop: 20, backgroundColor: K_DARK_BLUE, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  shopNowText: { color: '#fff', fontWeight: 'bold' }
});