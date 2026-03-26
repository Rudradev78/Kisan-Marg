import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground, 
  Image, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function AboutApp({ navigation }) {
  
  // App Details Data
  const appDetails = [
    { label: 'Version', value: '1.0.4' },
    { label: 'Build Number', value: '2026.03.26' },
    { label: 'Developer', value: 'Kisan Marg Team' },
    { label: 'Last Updated', value: 'March 2026' }
  ];

  return (
    <View style={styles.container}>
      {/* --- UPPER SECTION (HERO) --- */}
      <ImageBackground 
        source={{ uri: 'https://img.freepik.com/premium-photo/young-indian-farmer-green-agriculture-field_75648-6244.jpg?semt=ais_hybrid&w=740&q=80' }} 
        style={styles.heroBackground}
      >
        <LinearGradient 
          colors={['rgba(0,0,0,0.1)', 'transparent', K_GREEN]} 
          style={styles.heroOverlay}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
             <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <Image 
              source={require('../../assets/App-logo-only-no-bg.png')} 
              style={styles.wreathLogo} 
            />
            <Text style={styles.appName}>Kisan Marg</Text>
            <Text style={styles.appTagline}>A Direct path from Farm to Market</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* --- LOWER SECTION (CONTENT SHEET) --- */}
      <View style={styles.contentSheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sheetTitle}>Our Mission</Text>
          <Text style={styles.sheetSub}>Empowering India's Farming Community</Text>

          {/* 1. HIGHLIGHT CARDS */}
          <View style={styles.cardsRow}>
            <View style={styles.aboutCard}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="leaf" size={32} color={K_GREEN} />
                </View>
                <Text style={styles.cardTitle}>Direct</Text>
                <Text style={styles.cardSubText}>No middle-men between you and the buyer.</Text>
            </View>

            <View style={styles.aboutCard}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="account-group" size={32} color={K_DARK_BLUE} />
                </View>
                <Text style={styles.cardTitle}>Community</Text>
                <Text style={styles.cardSubText}>Verified network of 10k+ Indian farmers.</Text>
            </View>
          </View>

          {/* 2. TECHNICAL DETAILS CARD */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsHeader}>App Information</Text>
            <View style={styles.detailsDivider} />
            
            {appDetails.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* 3. TRUST BANNER */}
          <View style={styles.trustBanner}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#f39c12" />
              <Text style={styles.trustText}>Secure & Transparent Transactions</Text>
          </View>

          {/* BACK BUTTON */}
          <TouchableOpacity 
            style={styles.mainBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.mainBtnText}>BACK TO SETTINGS</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Made with ❤️ for Indian Farmers</Text>
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  heroBackground: { width: width, height: height * 0.4 },
  heroOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  closeBtn: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 8, 
    borderRadius: 20 
  },
  logoArea: { alignItems: 'center' },
  wreathLogo: { width: 100, height: 100, resizeMode: 'contain', tintColor: '#fff' },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  appTagline: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 5 },

  contentSheet: { 
    flex: 1, 
    backgroundColor: '#fff', 
    marginTop: -50, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    paddingTop: 30
  },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  sheetTitle: { fontSize: 24, fontWeight: 'bold', color: K_DARK_BLUE, textAlign: 'center' },
  sheetSub: { fontSize: 14, color: '#888', marginTop: 5, marginBottom: 25, textAlign: 'center' },

  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  aboutCard: { 
    width: '48%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 3
  },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  cardSubText: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 4, lineHeight: 16 },

  // APP INFO CARD STYLES
  detailsCard: { 
    backgroundColor: '#fcfcfc', 
    borderRadius: 20, 
    padding: 20, 
    width: '100%',
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  detailsHeader: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 10 },
  detailsDivider: { height: 1, backgroundColor: '#eee', marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#888', fontSize: 14 },
  detailValue: { color: K_DARK_BLUE, fontWeight: '600', fontSize: 14 },

  trustBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20, 
    backgroundColor: '#fff9f0', 
    padding: 12, 
    borderRadius: 12 
  },
  trustText: { marginLeft: 10, color: '#f39c12', fontWeight: 'bold', fontSize: 13 },

  mainBtn: { 
    backgroundColor: K_GREEN, 
    width: '100%', 
    height: 55, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30,
    elevation: 4
  },
  mainBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  footerText: { textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 25, letterSpacing: 1 }
});