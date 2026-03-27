import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- LIBRARIES FOR IMAGE CAPTURE, SHARING & SAVING ---
import ViewShot from 'react-native-view-shot'; 
import * as Sharing from 'expo-sharing'; 
import * as MediaLibrary from 'expo-media-library'; 

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';
const K_RED = '#e74c3c';

export default function OrderDetails({ navigation, route }) {
  const { order } = route.params || {};
  
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- RECEIPT MODAL STATES & REFS ---
  const [modalVisible, setModalVisible] = useState(false);
  const viewShotRef = useRef();

  if (!order) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ddd" />
        <Text style={styles.errorTitle}>No Order Data Found</Text>
        <Text style={styles.errorSub}>We couldn't retrieve the details for this order.</Text>
        <TouchableOpacity 
            style={styles.errorBtn} 
            onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const steps = [
    { title: 'Order Placed', time: '27 Mar, 10:30 AM' },
    { title: 'Processing', time: '27 Mar, 02:15 PM' },
    { title: 'Shipped', time: '28 Mar, 09:00 AM' },
    { title: 'Delivered', time: '28 Mar, 04:00 PM' },
  ];

  const getStepStatus = (index) => {
    if (order.status === 'Cancelled') return '#ddd';
    const statusMap = { 'Processing': 1, 'Shipped': 2, 'Delivered': 3 };
    const currentLevel = statusMap[order.status] || 0;
    return index <= currentLevel ? K_GREEN : '#eee';
  };

  // --- RECEIPT LOGIC ---
  const handleCaptureAndShare = async () => {
    try {
      if (!viewShotRef.current) return;
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not capture receipt for sharing.");
    }
  };

  const handleCaptureAndSave = async () => {
    try {
      if (!viewShotRef.current) return;
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status === 'granted') {
        const uri = await viewShotRef.current.capture();
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success ✅", "Receipt has been saved to your Gallery!");
      } else {
        Alert.alert("Permission Denied", "We need storage permissions to save the receipt.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save the image to gallery.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        {/* --- 1. ORDER ROADMAP --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Order Roadmap</Text>
          {order.status === 'Cancelled' ? (
            <View style={styles.cancelledBox}>
                <Ionicons name="close-circle" size={20} color={K_RED} />
                <Text style={styles.cancelledText}>This order was cancelled.</Text>
            </View>
          ) : (
            <View style={styles.roadmapContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={[styles.dot, { backgroundColor: getStepStatus(index) }]} />
                    {index !== steps.length - 1 && (
                        <View style={[styles.line, { backgroundColor: getStepStatus(index + 1) }]} />
                    )}
                  </View>
                  <View style={styles.stepRight}>
                    <Text style={[styles.stepTitle, { color: getStepStatus(index) === K_GREEN ? K_DARK_BLUE : '#ccc' }]}>{step.title}</Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* --- 2. CLICKABLE PRODUCT CARD --- */}
        <TouchableOpacity 
            style={styles.sectionCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductDetails', { product: order })}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Items Ordered</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </View>
          <View style={styles.productRow}>
            <Image source={{ uri: order.img }} style={styles.prodImg} />
            <View style={styles.prodInfo}>
                <Text style={styles.prodName}>{order.name}</Text>
                <Text style={styles.sellerName}>Seller: <Text style={{fontWeight: 'bold'}}>{order.farmer || "Organic Farms"}</Text></Text>
                {/* 🟢 Added Unit: kg */}
                <Text style={styles.priceText}>₹{order.price} <Text style={styles.qtyLabel}>(Qty: {order.qty} kg)</Text></Text>
            </View>
          </View>
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Click card to view full product details</Text>
          </View>
        </TouchableOpacity>

        {/* --- 3. DELIVERY ADDRESS --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={18} color={K_GREEN} />
            <Text style={styles.addressText}>
                Plot No. 42, Niladri Vihar, Chandrasekharpur, Bhubaneswar, Odisha, 751021
            </Text>
          </View>
        </View>

        {/* --- 4. RATING & REVIEW (Not for Cancelled) --- */}
        {order.status !== 'Cancelled' && (
            <View style={styles.sectionCard}>
                <Text style={styles.cardTitle}>{isSubmitted ? "Your Feedback" : "Rate this Order"}</Text>
                
                <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity 
                            key={star} 
                            onPress={() => !isSubmitted && setUserRating(star)}
                        >
                            <Ionicons 
                                name={star <= userRating ? "star" : "star-outline"} 
                                size={32} 
                                color={star <= userRating ? K_ORANGE : "#ddd"} 
                                style={{ marginRight: 8 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {isSubmitted ? (
                    <View style={styles.submittedContainer}>
                        <Text style={styles.submittedReview}>"{review || "Great products, very fresh!"}"</Text>
                        <Text style={styles.thanksText}>Thanks for your feedback!</Text>
                    </View>
                ) : (
                    <View>
                        <TextInput 
                            style={styles.reviewInput}
                            placeholder="Write a review for the farmer..."
                            multiline
                            value={review}
                            onChangeText={setReview}
                            placeholderTextColor="#bbb"
                        />
                        <TouchableOpacity 
                            style={styles.submitBtn}
                            onPress={() => {
                                if(userRating === 0) return Alert.alert("Wait", "Please select a star rating");
                                setIsSubmitted(true);
                            }}
                        >
                            <Text style={styles.submitBtnText}>Submit Feedback</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )}

        {/* --- 5. VIEW RECEIPT BUTTON --- */}
        <TouchableOpacity 
            style={styles.receiptMainBtn} 
            onPress={() => setModalVisible(true)}
        >
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.receiptMainBtnText}>View Order Receipt</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- RECEIPT MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Receipt</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#ddd" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }} style={styles.receiptViewshotContainer}>
                <View style={styles.receiptDetails}>
                  
                  {/* BRANDING & LOGO */}
                  <View style={styles.receiptHeaderRow}>
                    <View style={{flex: 1}}>
                      <Text style={styles.sellerLabel}>SELLER / FARMER</Text>
                      <Text style={styles.sellerName}>{order.farmer || "Organic Farms"}</Text>
                      <Text style={styles.addressValSmall}>Verified Kisan Marg Partner</Text>
                    </View>
                    <Image source={require('../../assets/App-logo-only-no-bg.png')} style={styles.receiptLogo} />
                  </View>

                  <View style={styles.receiptIDRow}>
                     <Text style={styles.receiptLabel}>Order ID</Text>
                     <Text style={styles.receiptValue}>#KM-{order.id || "2026-X"}</Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  {/* BUYER & PRODUCT INFO */}
                  <View style={styles.receiptInfoGrid}>
                    <View style={styles.infoGroupFull}>
                      <Text style={styles.infoLabel}>DELIVERY ADDRESS</Text>
                      <Text style={styles.infoVal}>Smruti Ranjan</Text>
                      <Text style={styles.addressValSmall}>Plot No. 42, Niladri Vihar, Bhubaneswar, Odisha</Text>
                    </View>
                    
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>DATE</Text><Text style={styles.infoVal}>27 Mar 2026</Text></View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>PRODUCT</Text><Text style={styles.infoVal}>{order.name}</Text></View>
                    {/* 🟢 Added Unit: kg */}
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>QUANTITY</Text><Text style={styles.infoVal}>{order.qty} kg</Text></View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>STATUS</Text><Text style={styles.infoVal}>{order.status}</Text></View>
                    
                    {/* 🟢 Added Payment Method & Transaction ID */}
                    <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>PAYMENT METHOD</Text>
                        <Text style={styles.infoVal}>{order.paymentMethod === 'COD' ? "Cash on Delivery" : (order.paymentMethod || "Online Payment")}</Text>
                    </View>
                    <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>TRANSACTION ID</Text>
                        <Text style={styles.infoVal}>{order.paymentMethod === 'COD' ? "N/A (Pay on Delivery)" : (order.transactionId || "TXN-882104")}</Text>
                    </View>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Paid</Text>
                    <Text style={styles.totalValue}>₹{order.price}</Text>
                  </View>

                  <Text style={styles.receiptFooterText}>Generated via Kisan Marg • A Direct Path from Farm to Market</Text>
                </View>
              </ViewShot>

              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.downloadBtn} onPress={handleCaptureAndSave}>
                  <Ionicons name="download-outline" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}> Download</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareBtn} onPress={handleCaptureAndShare}>
                  <Ionicons name="share-social-outline" size={20} color={K_GREEN} />
                  <Text style={[styles.actionBtnText, {color: K_GREEN}]}> Share Receipt</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  
  sectionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: K_GREEN, paddingLeft: 10 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  
  roadmapContainer: { paddingLeft: 10 },
  stepRow: { flexDirection: 'row', height: 60 },
  stepLeft: { alignItems: 'center', marginRight: 15 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: -2 },
  stepRight: { paddingTop: -2 },
  stepTitle: { fontSize: 14, fontWeight: 'bold' },
  stepTime: { fontSize: 11, color: '#aaa', marginTop: 2 },
  
  cancelledBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff1f0', padding: 12, borderRadius: 12 },
  cancelledText: { color: K_RED, marginLeft: 10, fontWeight: 'bold', fontSize: 13 },
  
  productRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  prodImg: { width: 75, height: 75, borderRadius: 15 },
  prodInfo: { marginLeft: 15, flex: 1 },
  prodName: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE },
  sellerName: { fontSize: 12, color: '#777', marginVertical: 4 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: K_GREEN },
  qtyLabel: { fontSize: 12, color: '#999', fontWeight: 'normal' },
  
  tapHint: { marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f9f9f9', alignItems: 'center' },
  tapHintText: { fontSize: 10, color: '#bbb', fontStyle: 'italic' },
  
  addressBox: { flexDirection: 'row', alignItems: 'flex-start' },
  addressText: { fontSize: 13, color: '#666', lineHeight: 20, marginLeft: 8, flex: 1 },
  
  starRow: { flexDirection: 'row', marginVertical: 10 },
  reviewInput: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, height: 80, textAlignVertical: 'top', marginTop: 10, borderWidth: 1, borderColor: '#eee', color: K_DARK_BLUE },
  submitBtn: { backgroundColor: K_DARK_BLUE, borderRadius: 15, padding: 16, alignItems: 'center', marginTop: 15 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 0.5 },
  
  submittedContainer: { marginTop: 5 },
  submittedReview: { fontStyle: 'italic', color: '#555', fontSize: 14, lineHeight: 20 },
  thanksText: { color: K_GREEN, fontWeight: 'bold', fontSize: 12, marginTop: 10 },
  
  errorContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 20 },
  errorSub: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  errorBtn: { marginTop: 30, backgroundColor: K_GREEN, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 15 },
  errorBtnText: { color: '#fff', fontWeight: 'bold' },

  receiptMainBtn: { backgroundColor: K_DARK_BLUE, borderRadius: 20, padding: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30, elevation: 5 },
  receiptMainBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: height * 0.85 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE },
  
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
  infoVal: { fontSize: 14, fontWeight: 'bold', color: K_DARK_BLUE },
  
  totalRow: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: K_GREEN },
  receiptFooterText: { textAlign: 'center', fontSize: 9, color: '#ccc', marginTop: 15, fontStyle: 'italic' },
  
  modalActionRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', paddingBottom: 20 },
  downloadBtn: { backgroundColor: K_DARK_BLUE, flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  shareBtn: { backgroundColor: '#fff', flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: K_GREEN },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});