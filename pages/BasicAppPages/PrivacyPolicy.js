import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function PrivacyPolicy({ navigation, route }) {
  // Detect role from navigation params (default to buyer)
  const { userRole } = route.params || { userRole: 'buyer' };

  const PolicySection = ({ icon, title, content, iconFamily = 'Ionicons' }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          {iconFamily === 'Ionicons' ? (
            <Ionicons name={icon} size={20} color={K_GREEN} />
          ) : (
            <MaterialCommunityIcons name={icon} size={20} color={K_GREEN} />
          )}
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* --- STICKY HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{userRole.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- 1. TRUST SUMMARY CARD --- */}
        <LinearGradient colors={[K_DARK_BLUE, '#1a3a5f']} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="shield-check" size={24} color={K_GREEN} />
            <Text style={styles.summaryHeaderText}>Our Privacy Promise</Text>
          </View>
          <Text style={styles.summarySub}>
            At Kisan Marg, your data is as valuable as your harvest. We use it only to bridge the gap between Farm and Market.
          </Text>
          <View style={styles.dividerLight} />
          <View style={styles.promiseRow}>
            <Ionicons name="eye-off" size={16} color={K_GREEN} />
            <Text style={styles.promiseText}>No selling data to 3rd party advertisers.</Text>
          </View>
          <View style={styles.promiseRow}>
            <Ionicons name="lock-closed" size={16} color={K_GREEN} />
            <Text style={styles.promiseText}>Bank-grade encryption for all payments.</Text>
          </View>
        </LinearGradient>

        {/* --- 2. DETAILED SECTIONS (THE CORE POLICY) --- */}
        
        <PolicySection 
          icon="information-circle-outline"
          title="1. Introduction"
          content={`Welcome to Kisan Marg. This policy explains how we handle your information when you use our platform to ${userRole === 'farmer' ? 'list and sell your crops' : 'browse and buy fresh produce'}. By using our app, you agree to the collection and use of information in accordance with this policy.`}
        />

        <PolicySection 
          icon="finger-print"
          title="2. Data We Collect"
          content={userRole === 'farmer' 
            ? "For Farmers, we collect Identity Proof (Aadhaar/Voter ID), Farm location coordinates, Bank Account details for direct payouts, and high-resolution images of your produce for listing quality." 
            : "For Buyers, we collect your Name, mobile number, precise delivery address, and device information to optimize your shopping experience and prevent fraudulent transactions."}
        />

        <PolicySection 
          icon="location-outline"
          title="3. Location Tracking"
          content="Kisan Marg requires 'Always On' or 'While Using' location permissions. For Farmers, this ensures accurate harvest origins. For Buyers, this helps us show 'Farmers Near You' to minimize carbon footprints and delivery times."
        />

        {/* SECTION SPECIFIC TO ROLE */}
        {userRole === 'farmer' ? (
          <PolicySection 
            icon="bank-outline"
            title="4. Financial Transparency"
            content="To ensure you get paid on time, your bank details are processed through secure APIs. We do not store your raw banking credentials. We only record the transaction ID and success status of your payouts."
          />
        ) : (
          <PolicySection 
            icon="cart-outline"
            title="4. Purchase History"
            content="We record your previous orders to suggest seasonal favorites and to handle refund requests efficiently. Your 'Wishlist' items are stored locally to help you plan your future kitchen needs."
          />
        )}

        <PolicySection 
          icon="account-group-outline"
          iconFamily="MaterialCommunityIcons"
          title="5. Data Sharing"
          content="The 'Handshake' is vital. Buyers see Farmer names and farm locations. Farmers see Buyer names and delivery addresses. We do not share your data with insurance companies, credit bureaus, or marketing firms without explicit consent."
        />

        <PolicySection 
          icon="shield-alert-outline"
          title="6. Data Security"
          content="We implement Secure Socket Layer (SSL) technology and end-to-end encryption. However, no method of transmission over the internet is 100% secure. We urge you to keep your App OTPs and PINs private at all times."
        />

        <PolicySection 
          icon="trash-outline"
          title="7. Account Deletion"
          content="You have the 'Right to be Forgotten.' If you choose to leave the Kisan Marg family, you can request account deletion via Settings. We will purge all personal identifiers within 30 business days, keeping only non-identifiable tax records."
        />

        <PolicySection 
          icon="update"
          iconFamily="MaterialCommunityIcons"
          title="8. Policy Updates"
          content="We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Updated' date at the bottom."
        />

        {/* --- 3. THE "HANDSHAKE" FOOTER --- */}
        <View style={styles.footerInfo}>
          <View style={styles.footerLine} />
          <MaterialCommunityIcons name="leaf" size={30} color={K_GREEN} />
          <Text style={styles.footerBrand}>Kisan Marg Trust Protocol</Text>
          <Text style={styles.lastUpdated}>Version 1.0.4 • Last Updated: 27 Mar 2026</Text>
          
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>Report a Privacy Concern</Text>
          </TouchableOpacity>
        </View>

        {/* --- 4. THE ACCEPTANCE BUTTON --- */}
        <TouchableOpacity 
          style={styles.finalBtn} 
          onPress={() => navigation.goBack()}
        >
          <LinearGradient 
            colors={[K_GREEN, '#8cc63f']} 
            start={{x:0, y:0}} 
            end={{x:1, y:0}} 
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>I ACKNOWLEDGE & AGREE</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff'
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, flex: 1, marginLeft: 15 },
  roleBadge: { backgroundColor: '#f0f9eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: 'bold', color: K_GREEN },

  scrollContent: { padding: 25 },

  // SUMMARY CARD
  summaryCard: { 
    borderRadius: 25, 
    padding: 22, 
    marginBottom: 35, 
    elevation: 8,
    shadowColor: K_DARK_BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  summaryHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  summarySub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 },
  dividerLight: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  promiseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  promiseText: { color: '#fff', fontSize: 12, marginLeft: 10, fontWeight: '500' },

  // SECTIONS
  section: { marginBottom: 35 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#f0f9eb', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: K_DARK_BLUE },
  sectionContent: { fontSize: 14, color: '#555', lineHeight: 24, paddingLeft: 5 },

  // FOOTER
  footerInfo: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  footerLine: { width: 40, height: 4, backgroundColor: '#eee', borderRadius: 2, marginBottom: 25 },
  footerBrand: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 10 },
  lastUpdated: { fontSize: 12, color: '#bbb', marginTop: 5 },
  contactBtn: { marginTop: 20, padding: 10 },
  contactBtnText: { color: K_GREEN, fontWeight: 'bold', fontSize: 13, textDecorationLine: 'underline' },

  // BUTTON
  finalBtn: { marginTop: 10, marginBottom: 30 },
  btnGradient: { padding: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  btnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1.2, fontSize: 14 }
});