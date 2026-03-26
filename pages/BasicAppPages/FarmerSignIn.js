import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image,
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Using Expo icons

const { width, height } = Dimensions.get('window');

const VEGETABLE_IMAGE = require('../../assets/Vegetables.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerSignIn({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleAction = () => {
    if (!isOtpSent) {
      if (phone.length === 10) setIsOtpSent(true);
      else alert("Please enter a valid 10-digit number");
    } else {
      navigation.replace('FarmerHome'); 
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
          
          {/* TOP SECTION: IMMERSIVE APP-THEMED IMAGE */}
          <View style={styles.headerContainer}>
            <Image source={VEGETABLE_IMAGE} style={styles.headerImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', K_GREEN]} style={styles.gradientOverlay} />
            <View style={styles.centeredLogoContainer}>
               <Image source={LOGO_WREATH} style={styles.largeLogo} resizeMode="contain" />
            </View>
          </View>

          {/* BOTTOM SECTION: WHITE CARD WITH FORM */}
          <View style={styles.contentCard}>
            
            {/* NEW: TITLE ROW WITH CHANGE ROLE BUTTON */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Farmer Sign In</Text>
                <Text style={styles.subtitle}>Welcome back!</Text>
              </View>

              <TouchableOpacity 
                style={styles.inlineChangeRole} 
                onPress={() => navigation.replace('RoleSelection')}
              >
                <Ionicons name="swap-horizontal" size={18} color={K_GREEN} />
                <Text style={styles.changeRoleBtnText}>Change Role</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="9876543210" 
                keyboardType="phone-pad" 
                maxLength={10} 
                value={phone}
                onChangeText={setPhone}
                editable={!isOtpSent}
              />

              {isOtpSent && (
                <View style={{marginTop: 20}}>
                  <Text style={styles.label}>OTP Code</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="123456" 
                    keyboardType="number-pad" 
                    maxLength={6} 
                    secureTextEntry 
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={handleAction}>
              <Text style={styles.buttonText}>{isOtpSent ? "SIGN IN" : "SEND OTP"}</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('FarmerSignUp')}>
                <Text style={styles.footerText}>New to Kisan Marg? <Text style={{fontWeight:'bold', color: K_GREEN}}>Sign Up</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: K_GREEN },
  scrollContent: { flexGrow: 1 },
  headerContainer: { height: height * 0.35, width: '100%' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  centeredLogoContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  largeLogo: { width: 200, height: 200 },
  
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 35, 
    paddingHorizontal: 25,
    marginTop: -30,
  },
  
  // NEW STYLES FOR THE TITLE ROW
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE },
  subtitle: { fontSize: 14, color: '#777', marginTop: 2 },
  
  inlineChangeRole: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9eb', // Light green tint
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0f2d8',
  },
  changeRoleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: K_GREEN,
    marginLeft: 5,
  },

  formContainer: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: K_DARK_BLUE, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, fontSize: 16, color: K_DARK_BLUE, backgroundColor: '#f9f9f9' },
  mainButton: { backgroundColor: K_DARK_BLUE, paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  footerLinks: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: K_DARK_BLUE },
});