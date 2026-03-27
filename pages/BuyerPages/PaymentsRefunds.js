import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const K_ORANGE = '#f39c12';
const K_RED = '#e74c3c';

export default function PaymentsRefunds({ navigation }) {
  
  const transactions = [
    { id: 'TXN10293', date: '27 Mar 2026', amount: '450', status: 'Completed', item: 'Organic Potato & Tomato' },
    { id: 'TXN10285', date: '24 Mar 2026', amount: '120', status: 'Refunded', item: 'Green Peas (Damaged)' },
    { id: 'TXN10271', date: '20 Mar 2026', amount: '890', status: 'Failed', item: 'Monthly Veggie Bundle' },
  ];

  const StatusBadge = ({ status }) => {
    let bgColor = '#f0f0f0';
    let textColor = '#888';
    
    if (status === 'Completed') { bgColor = '#f0f9eb'; textColor = K_GREEN; }
    if (status === 'Refunded') { bgColor = '#ebf3ff'; textColor = '#3498db'; }
    if (status === 'Failed') { bgColor = '#fff1f0'; textColor = K_RED; }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments & Refunds</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color={K_GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- 1. ACTIVE REFUND TRACKER --- */}
        <View style={styles.refundCard}>
          <View style={styles.refundHeader}>
            <MaterialCommunityIcons name="cached" size={20} color="#fff" />
            <Text style={styles.refundHeaderText}>Active Refund</Text>
          </View>
          <View style={styles.refundBody}>
            <Text style={styles.refundAmount}>₹120.00</Text>
            <Text style={styles.refundStatus}>Expected in 2-3 business days</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.refundSub}>Returning to: SBI Bank (**** 4421)</Text>
          </View>
        </View>

        {/* --- 2. SAVED PAYMENT METHODS --- */}
        <Text style={styles.sectionTitle}>Saved Methods</Text>
        <View style={styles.methodsCard}>
          <TouchableOpacity style={styles.methodRow}>
            <View style={[styles.iconBox, { backgroundColor: '#f2f2f2' }]}>
              <FontAwesome5 name="google-pay" size={20} color={K_DARK_BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodName}>Google Pay</Text>
              <Text style={styles.methodSub}>smruti@okaxis</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <View style={styles.divider} />

          <TouchableOpacity style={styles.methodRow}>
            <View style={[styles.iconBox, { backgroundColor: '#f2f2f2' }]}>
              <Ionicons name="card" size={20} color={K_DARK_BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodName}>HDFC Debit Card</Text>
              <Text style={styles.methodSub}>**** **** **** 8821</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* --- 3. TRANSACTION HISTORY --- */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((txn, index) => (
          <TouchableOpacity key={txn.id} style={styles.txnCard}>
            <View style={styles.txnTop}>
              <View>
                <Text style={styles.txnItem} numberOfLines={1}>{txn.item}</Text>
                <Text style={styles.txnId}>{txn.id} • {txn.date}</Text>
              </View>
              <Text style={styles.txnAmount}>₹{txn.amount}</Text>
            </View>
            <View style={styles.txnBottom}>
              <StatusBadge status={txn.status} />
              <TouchableOpacity style={styles.invoiceBtn}>
                <Ionicons name="download-outline" size={14} color={K_GREEN} />
                <Text style={styles.invoiceText}>Invoice</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.allTxnBtn}>
          <Text style={styles.allTxnText}>View Full History</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  scrollContent: { padding: 20 },
  
  // REFUND TRACKER
  refundCard: { 
    backgroundColor: K_DARK_BLUE, 
    borderRadius: 25, 
    overflow: 'hidden', 
    marginBottom: 30,
    elevation: 5
  },
  refundHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: 12, 
    paddingHorizontal: 20 
  },
  refundHeaderText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  refundBody: { padding: 20 },
  refundAmount: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  refundStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 5 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginVertical: 15 },
  progressFill: { height: '100%', backgroundColor: K_GREEN, borderRadius: 3 },
  refundSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15, marginLeft: 5 },
  
  // METHODS
  methodsCard: { backgroundColor: '#fff', borderRadius: 20, padding: 5, marginBottom: 30, elevation: 2 },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  methodName: { fontSize: 15, fontWeight: 'bold', color: K_DARK_BLUE },
  methodSub: { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f8f8f8', marginHorizontal: 15 },

  // TRANSACTIONS
  txnCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 15, elevation: 2 },
  txnTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  txnItem: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, width: '70%' },
  txnId: { fontSize: 11, color: '#aaa', marginTop: 4 },
  txnAmount: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  txnBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  invoiceBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  invoiceText: { color: K_GREEN, fontSize: 12, fontWeight: 'bold', marginLeft: 5 },

  allTxnBtn: { padding: 15, alignItems: 'center', marginTop: 10 },
  allTxnText: { color: K_GREEN, fontWeight: 'bold', fontSize: 14 }
});