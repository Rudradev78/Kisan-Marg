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
  Platform, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const { width, height } = Dimensions.get('window');

const VEGETABLE_IMAGE = require('../../assets/Buyer2.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const B_ORANGE = '#FF5733';
const K_DARK_BLUE = '#112244';

export default function BuyerSignUp({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * STEP 1: INITIALIZE SIGNUP
   * Requests OTP for a new Buyer account.
   */
  const handleSendOTP = async () => {
    if (name.trim().length < 2) {
      Alert.alert("Input Error", "Please enter a valid name.");
      return;
    }
    if (phone.length !== 10) {
      Alert.alert("Input Error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        phno: phone,
        name: name,
        userType: 'Buyer' 
      });

      if (response.data.success) {
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "Verification code sent! Check your SMS or server logs.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert("Account Exists", "This number is already a registered Buyer. Please Log In.");
      } else {
        Alert.alert("Error", "Could not send OTP. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STEP 2: VERIFY AND FINALIZE
   * Creates the user in the DB and establishes the token-based session.
   */
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify', {
        phno: phone,
        otp: otp,
        userType: 'Buyer'
      });

      if (response.data.success) {
        // 🟢 Extract token and user details from backend response
        const { token } = response.data;
        const idFromDb = response.data.user.id || response.data.user._id;
        const { userType } = response.data.user;

        // 🟢 SECURE SESSION LOGIC: Store token, userId, and userType together
        const sessionData = {
          token: token,
          userId: idFromDb,
          userType: userType
        };

        // Persist to local storage for the API interceptor
        await AsyncStorage.setItem('userData', JSON.stringify(sessionData));
        
        console.log("✅ New Buyer Account Created & Secured:", sessionData);

        Alert.alert("Welcome!", "Your Buyer account is now active.");

        // 🟢 NAVIGATION: Pass userId as a parameter to BuyerHome
        navigation.replace('BuyerHome', { userId: idFromDb }); 
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";

      if (error.response?.status === 403) {
        Alert.alert("Account Locked", "Too many failed attempts. Please try again later.");
        navigation.replace('RoleSelection'); 
      } else {
        Alert.alert("Failed", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Image source={VEGETABLE_IMAGE} style={styles.headerImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', B_ORANGE]} style={styles.gradientOverlay} />
            <View style={styles.centeredLogoContainer}>
               <Image source={LOGO_WREATH} style={styles.largeLogo} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.titleRow}>
              <View style={{flex: 1}}>
                <Text style={styles.title}>Buyer Sign Up</Text>
                <Text style={styles.subtitle}>
                  {isOtpSent ? "Enter verification code" : "Direct farm-to-home shopping."}
                </Text>
              </View>
              
              {!isOtpSent && (
                <TouchableOpacity 
                  style={styles.inlineChangeRole} 
                  onPress={() => navigation.replace('RoleSelection')}
                >
                  <Ionicons name="swap-horizontal" size={18} color={B_ORANGE} />
                  <Text style={styles.changeRoleBtnText}>Role</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={[styles.input, isOtpSent && styles.disabledInput]} 
                placeholder="Enter your name" 
                value={name} 
                onChangeText={setName}
                editable={!isOtpSent && !isLoading}
                selectionColor={B_ORANGE}
              />

              <Text style={[styles.label, {marginTop: 20}]}>Mobile Number</Text>
              <TextInput 
                style={[styles.input, isOtpSent && styles.disabledInput]} 
                placeholder="9876543210" 
                keyboardType="phone-pad" 
                maxLength={10} 
                value={phone} 
                onChangeText={setPhone}
                editable={!isOtpSent && !isLoading}
                selectionColor={B_ORANGE}
              />

              {isOtpSent && (
                <View style={{marginTop: 20}}>
                  <Text style={styles.label}>6-Digit OTP</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="123456" 
                    keyboardType="number-pad" 
                    maxLength={6} 
                    value={otp}
                    onChangeText={setOtp}
                    autoFocus={true}
                    selectionColor={B_ORANGE}
                  />
                  <TouchableOpacity onPress={() => setIsOtpSent(false)} style={{marginTop: 12}}>
                    <Text style={{color: B_ORANGE, fontSize: 13, fontWeight: '700'}}>Change Name/Number?</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.mainButton, isLoading && { opacity: 0.7 }]} 
              onPress={isOtpSent ? handleVerifyOTP : handleSendOTP} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isOtpSent ? "VERIFY & REGISTER" : "SEND OTP"}
                </Text>
              )}
            </TouchableOpacity>

            {!isOtpSent && (
              <TouchableOpacity 
                style={styles.footerLinkContainer} 
                onPress={() => navigation.navigate('BuyerSignIn')}
              >
                 <Text style={styles.footerText}>
                   Already have an account? <Text style={{fontWeight:'bold', color: B_ORANGE}}>Log In</Text>
                 </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: B_ORANGE },
  scrollContent: { flexGrow: 1 },
  headerContainer: { height: height * 0.35, width: '100%' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  centeredLogoContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  largeLogo: { width: 180, height: 180 },
  contentCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingTop: 35, 
    paddingHorizontal: 25, 
    marginTop: -30, 
    paddingBottom: 40 
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE },
  subtitle: { fontSize: 14, color: '#777' },
  inlineChangeRole: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff5f2', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe8e3'
  },
  changeRoleBtnText: { fontSize: 12, fontWeight: '700', color: B_ORANGE, marginLeft: 5 },
  formContainer: { marginBottom: 35 },
  label: { fontSize: 14, fontWeight: '600', color: K_DARK_BLUE, marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 16, 
    color: K_DARK_BLUE, 
    backgroundColor: '#f9f9f9' 
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
    color: '#aaa',
    borderColor: '#ddd'
  },
  mainButton: { 
    backgroundColor: K_DARK_BLUE, 
    paddingVertical: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  footerLinkContainer: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: K_DARK_BLUE },
});