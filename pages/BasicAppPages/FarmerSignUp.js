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

const VEGETABLE_IMAGE = require('../../assets/Vegetables2.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerSignUp({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * STEP 1: INITIALIZE SIGNUP
   * Sends name and phone to request an OTP.
   */
  const handleSendOTP = async () => {
    if (name.trim().length < 3) {
      Alert.alert("Invalid Name", "Please enter your full name.");
      return;
    }
    if (phone.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', {
        phno: phone,
        name: name, // Name signals to the backend that this is a registration attempt
        userType: 'Farmer'
      });

      if (response.data.success) {
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "A verification code has been sent to your phone.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert("Account Exists", "This number is already registered as a Farmer. Please Sign In.");
      } else {
        Alert.alert("Error", "Could not send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STEP 2: VERIFY AND CREATE ACCOUNT
   * Finalizes the account creation and saves the session.
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
        userType: 'Farmer'
      });

      if (response.data.success) {
        // 🟢 Extract token and user details from response
        const { token } = response.data;
        const idFromDb = response.data.user._id || response.data.user.id;
        const { userType } = response.data.user;

        // 🟢 UNIFIED SAVING LOGIC: Store token, userId, and userType
        const sessionData = {
          token: token,
          userId: idFromDb,
          userType: userType
        };

        await AsyncStorage.setItem('userData', JSON.stringify(sessionData));
        
        console.log("✅ New Farmer Account Created & Secured:", sessionData);

        Alert.alert("Success", "Account created successfully!");

        // 🟢 NAVIGATION: Pass userId as a parameter to FarmerHome
        navigation.replace('FarmerHome', { userId: idFromDb });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      
      if (error.response?.status === 403) {
        Alert.alert("Locked", "Too many incorrect attempts. Please try again later.");
        navigation.replace('RoleSelection'); 
      } else {
        Alert.alert("Verification Failed", msg);
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
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', K_GREEN]} style={styles.gradientOverlay} />
            <View style={styles.centeredLogoContainer}>
               <Image source={LOGO_WREATH} style={styles.largeLogo} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.contentCard}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Farmer Sign Up</Text>
                <Text style={styles.subtitle}>
                  {isOtpSent ? "Verify your phone number" : "Join the digital mandi"}
                </Text>
              </View>

              {!isOtpSent && (
                <TouchableOpacity 
                  style={styles.inlineChangeRole} 
                  onPress={() => navigation.replace('RoleSelection')}
                >
                  <Ionicons name="swap-horizontal" size={18} color={K_GREEN} />
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
                selectionColor={K_GREEN}
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
                selectionColor={K_GREEN}
              />

              {isOtpSent && (
                <View style={{marginTop: 20}}>
                  <Text style={styles.label}>Enter 6-Digit OTP</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="123456" 
                    keyboardType="number-pad" 
                    maxLength={6} 
                    value={otp}
                    onChangeText={setOtp}
                    autoFocus={true}
                    selectionColor={K_GREEN}
                  />
                  <TouchableOpacity onPress={() => setIsOtpSent(false)} style={{marginTop: 10}}>
                    <Text style={{color: K_GREEN, fontSize: 12, fontWeight: '600'}}>Edit details?</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.mainButton, isLoading && { opacity: 0.8 }]} 
              onPress={isOtpSent ? handleVerifyOTP : handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isOtpSent ? "VERIFY & CREATE ACCOUNT" : "SEND OTP"}
                </Text>
              )}
            </TouchableOpacity>

            {!isOtpSent && (
              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => navigation.navigate('FarmerSignIn')}>
                  <Text style={styles.footerText}>
                    Already have an account? <Text style={{fontWeight:'bold', color: K_GREEN}}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE },
  subtitle: { fontSize: 14, color: '#777' },
  inlineChangeRole: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9eb', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e0f2d8' },
  changeRoleBtnText: { fontSize: 12, fontWeight: '700', color: K_GREEN, marginLeft: 5 },
  formContainer: { marginBottom: 35 },
  label: { fontSize: 14, fontWeight: '600', color: K_DARK_BLUE, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, fontSize: 16, backgroundColor: '#f9f9f9', color: K_DARK_BLUE },
  disabledInput: { backgroundColor: '#f0f0f0', color: '#999', borderColor: '#ddd' },
  mainButton: { backgroundColor: K_DARK_BLUE, paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  footerLinks: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: K_DARK_BLUE },
});