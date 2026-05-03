import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Image, TextInput, Alert, Dimensions, Modal, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot'; 
import * as Sharing from 'expo-sharing'; 
import * as MediaLibrary from 'expo-media-library'; 
import apiClient from '../../services/api'; 
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';
const K_RED = '#e74c3c';

export default function OrderDetails({ navigation, route }) {
  const params = route.params || {};
  const initialOrder = params.order || params.orderData || null;
  
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [userRating, setUserRating] = useState(initialOrder?.rating || 0);
  const [review, setReview] = useState(initialOrder?.review || '');
  const [isSubmitted, setIsSubmitted] = useState(!!initialOrder?.rating);

  // --- MODAL STATES ---
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const viewShotRef = useRef();

  useFocusEffect(
    useCallback(() => {
      if (initialOrder?._id) fetchOrderDetails();
    }, [initialOrder?._id])
  );

  const fetchOrderDetails = async () => {
    try {
      const res = await apiClient.get(`/orders/${initialOrder?._id}`);
      if (res.data.success) {
        console.log("FRESH ORDER DATA:", JSON.stringify(res.data.data.buyerId, null, 2));
        setOrder(res.data.data);
        setUserRating(res.data.data.rating || 0);
        setReview(res.data.data.review || '');
        setIsSubmitted(!!res.data.data.rating);
      }
    } catch (err) {
      console.log("Order Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  
  // --- LOGIC: Submit Cancellation ---
  const submitCancellation = async () => {
    if (!cancelReason.trim()) return Alert.alert("Required", "Please provide a reason for cancellation.");
    
    setIsCancelling(true);
    try {
      // Saving reason in the review section as requested
      const res = await apiClient.put(`/orders/${order._id}/status`, {
        status: 'Cancelled',
        review: `Cancellation Reason: ${cancelReason}` 
      });

      if (res.data.success) {
        setOrder(res.data.data);
        setCancelModalVisible(false);
        Alert.alert("Cancelled", "Your order has been cancelled successfully.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not cancel order at this time.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (userRating === 0) return Alert.alert("Wait", "Please select a star rating");
    try {
      const res = await apiClient.put(`/orders/${order._id}/review`, {
        rating: userRating,
        review: review
      });
      if (res.data.success) {
        setIsSubmitted(true);
        Alert.alert("Success", "Thank you for your feedback!");
      }
    } catch (err) {
      Alert.alert("Error", "Could not submit review.");
    }
  };

  // Roadmap Logic
  const steps = [
    { title: 'Order Placed', status: 'Requested' },
    { title: 'Accepted', status: 'Accepted' },
    { title: 'Packed', status: 'Packed' },
    { title: 'Out for Delivery', status: 'Out for Delivery' },
    { title: 'Delivered', status: 'Completed' },
  ];

  const getStepStatus = (index) => {
    if (order?.status === 'Cancelled') return '#ddd';
    const statusPriority = { 'Requested': 0, 'Accepted': 1, 'Packed': 2, 'Out for Delivery': 3, 'Completed': 4 };
    return statusPriority[order?.status] >= index ? K_GREEN : '#eee';
  };

  // --- RECEIPT & PERMISSIONS ---
  const handleCaptureAndShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Could not capture receipt.");
    }
  };

  const handleCaptureAndSave = async () => {
    try {
      // 🟢 The 'true' argument requests write-only permission
      // This avoids asking for READ_MEDIA_AUDIO or READ_MEDIA_VIDEO
      const { status } = await MediaLibrary.requestPermissionsAsync(true); 
      
      if (status === 'granted') {
        const uri = await viewShotRef.current.capture();
        const asset = await MediaLibrary.createAssetAsync(uri);
        
        // This creates/saves it into a specific folder
        await MediaLibrary.createAlbumAsync("KisanMarg", asset, false);
        
        Alert.alert("Success ✅", "Receipt saved to Gallery!");
      } else {
        Alert.alert("Permission Denied", "Gallery access is required to save the receipt.");
      }
    } catch (error) {
      console.log("Save Error:", error);
      Alert.alert("Error", "Failed to save the image. Make sure you have given permission.");
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={K_GREEN}/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        {/* ROADMAP */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Order Roadmap</Text>
          {order?.status === 'Cancelled' ? (
            <View style={styles.cancelledBox}>
                <Ionicons name="close-circle" size={20} color={K_RED} />
                <Text style={styles.cancelledText}>Order Cancelled: {order.review || "No reason provided"}</Text>
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
                    <Text style={styles.stepTime}>{getStepStatus(index) === K_GREEN ? "Updated" : "Pending"}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* PRODUCT CARD */}
        <TouchableOpacity style={styles.sectionCard} activeOpacity={0.8} onPress={() => navigation.navigate('ProductDetails', { productId: order.product?._id })}>
          <View style={styles.cardHeaderRow}><Text style={styles.cardTitle}>Items Ordered</Text><Ionicons name="chevron-forward" size={16} color="#ccc" /></View>
          <View style={styles.productRow}>
            <Image source={{ uri: order.product?.productImageURL }} style={styles.prodImg} />
            <View style={styles.prodInfo}>
                <Text style={styles.prodName}>{order.product?.productName}</Text>
                <Text style={styles.sellerName}>Seller: <Text style={{fontWeight: 'bold'}}>{order.farmerId?.farmName}</Text></Text>
                <Text style={styles.priceText}>₹{order.totalPrice} <Text style={styles.qtyLabel}>(Qty: {order.quantity} {order.product?.unitGiven})</Text></Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* FEEDBACK SECTION */}
        {order?.status === 'Completed' && (
            <View style={styles.sectionCard}>
                <Text style={styles.cardTitle}>{isSubmitted ? "Your Feedback" : "Rate this Order"}</Text>
                <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => !isSubmitted && setUserRating(star)}>
                            <Ionicons name={star <= userRating ? "star" : "star-outline"} size={32} color={star <= userRating ? K_ORANGE : "#ddd"} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    ))}
                </View>
                {isSubmitted ? (
                    <View style={styles.submittedContainer}>
                        <Text style={styles.submittedReview}>"{review}"</Text>
                        <Text style={styles.thanksText}>Farmer appreciated your feedback!</Text>
                    </View>
                ) : (
                    <View>
                        <TextInput style={styles.reviewInput} placeholder="Write a review for the farmer..." multiline value={review} onChangeText={setReview} placeholderTextColor="#bbb" />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitFeedback}><Text style={styles.submitBtnText}>Submit Feedback</Text></TouchableOpacity>
                    </View>
                )}
            </View>
        )}

        {/* ACTIONS */}
        <TouchableOpacity style={styles.receiptMainBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.receiptMainBtnText}>View Order Receipt</Text>
        </TouchableOpacity>

        {(order?.status === 'Requested' || order?.status === 'Accepted') && (
          <TouchableOpacity style={[styles.submitBtn, {backgroundColor: '#fff', borderWidth: 1, borderColor: K_RED, marginTop: 0}]} onPress={() => setCancelModalVisible(true)}>
              <Text style={[styles.submitBtnText, {color: K_RED}]}>Cancel Order</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* RECEIPT MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Receipt</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close-circle" size={30} color="#ddd" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }} style={styles.receiptViewshotContainer}>
                <View style={styles.receiptDetails}>
                  <View style={styles.receiptHeaderRow}>
                    <View style={{flex: 1}}>
                      <Text style={styles.sellerLabel}>SELLER / FARMER</Text>
                      <Text style={styles.sellerName}>{order.farmerId?.farmName}</Text>
                      <Text style={styles.addressValSmall}>{order.farmerId?.location}</Text>
                    </View>
                    <Image source={require('../../assets/App-logo-only-no-bg.png')} style={styles.receiptLogo} />
                  </View>
                  <View style={styles.receiptIDRow}>
                     <Text style={styles.receiptLabel}>Order ID</Text>
                     <Text style={styles.receiptValue}>#KM-{order._id.substring(18).toUpperCase()}</Text>
                  </View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptInfoGrid}>
                    <View style={styles.infoGroupFull}>
                      <Text style={styles.infoLabel}>BUYER DETAILS</Text>
                      <Text style={styles.infoVal}>{order.buyerId?.name}</Text>
                      <Text style={styles.addressValSmall}>Ph: {order.buyerId?.phno}</Text>
                    </View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>DATE</Text><Text style={styles.infoVal}>{new Date(order.createdAt).toLocaleDateString()}</Text></View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>PRODUCT</Text><Text style={styles.infoVal}>{order.product?.productName}</Text></View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>QUANTITY</Text><Text style={styles.infoVal}>{order.quantity} {order.product?.unitGiven}</Text></View>
                    <View style={styles.infoGroup}><Text style={styles.infoLabel}>TXN TYPE</Text><Text style={styles.infoVal}>{order.transactionId === 'COD' ? 'CASH' : 'ONLINE'}</Text></View>
                    <View style={styles.infoGroupFull}>
                        <Text style={styles.infoLabel}>TRANSACTION ID</Text>
                        <Text style={styles.infoVal}>{order.transactionId || "N/A"}</Text> 
                    </View>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Paid</Text>
                    <Text style={styles.totalValue}>₹{order.totalPrice}</Text>
                  </View>
                </View>
              </ViewShot>
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.downloadBtn} onPress={handleCaptureAndSave}><Ionicons name="download-outline" size={20} color="#fff" /><Text style={styles.actionBtnText}> Save</Text></TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={handleCaptureAndShare}><Ionicons name="share-social-outline" size={20} color={K_GREEN} /><Text style={[styles.actionBtnText, {color: K_GREEN}]}> Share</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CANCELLATION MODAL */}
      <Modal animationType="fade" transparent={true} visible={cancelModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {height: 'auto', paddingBottom: 40}]}>
            <Text style={styles.modalTitle}>Cancel Order</Text>
            <Text style={[styles.sellerLabel, {marginVertical: 10}]}>REASON FOR CANCELLATION</Text>
            <TextInput 
              style={[styles.reviewInput, {height: 100}]} 
              placeholder="Please tell us why you are cancelling..." 
              multiline 
              value={cancelReason} 
              onChangeText={setCancelReason} 
            />
            <View style={[styles.modalActionRow, {marginTop: 20}]}>
              <TouchableOpacity style={[styles.shareBtn, {borderColor: '#ccc'}]} onPress={() => setCancelModalVisible(false)}><Text style={{color: '#888', fontWeight: 'bold'}}>Close</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.downloadBtn, {backgroundColor: K_RED}]} onPress={submitCancellation}>
                {isCancelling ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>Cancel Now</Text>}
              </TouchableOpacity>
            </View>
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
  cancelledText: { color: K_RED, marginLeft: 10, fontWeight: 'bold', fontSize: 13, flex: 1 },
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  receiptMainBtn: { backgroundColor: K_DARK_BLUE, borderRadius: 20, padding: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 15, elevation: 5 },
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