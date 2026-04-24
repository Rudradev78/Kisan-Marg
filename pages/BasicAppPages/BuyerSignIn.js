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

const VEGETABLE_IMAGE = require('../../assets/Buyer.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const B_ORANGE = '#FF5733';
const K_DARK_BLUE = '#112244';

export default function BuyerSignIn({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // STEP 1: Check DB and Request OTP
  const requestOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a 10-digit phone number.");
      return;
    }

    setIsLoading(true);
    try {
      // Note: We don't send 'name' here, so backend knows it is a Sign In attempt
      const response = await apiClient.post('/auth/login', {
        phno: phone,
        userType: 'Buyer'
      });

      if (response.data.success) {
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "A verification code has been sent to your phone.");
      }
    } catch (error) {
      // Handle "No Account Found" (404)
      if (error.response && error.response.status === 404) {
        Alert.alert(
          "Account Not Found",
          "There is no Buyer account linked to this number. Would you like to create one?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Up", onPress: () => navigation.navigate('BuyerSignUp') }
          ]
        );
      } else {
        Alert.alert("Error", error.response?.data?.message || "Server connection failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP and Save Session
  const verifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit code.");
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
        // Securely store the JWT and user role
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userType', 'Buyer');
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

        navigation.replace('BuyerHome'); 
      }
    } catch (error) {
      Alert.alert("Verification Failed", error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = () => {
    if (!isOtpSent) {
      requestOTP();
    } else {
      verifyOTP();
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
                <Text style={styles.title}>Buyer Sign In</Text>
                <Text style={styles.subtitle}>{isOtpSent ? "Enter the 6-digit code" : "Fresh produce is waiting!"}</Text>
              </View>

              <TouchableOpacity 
                style={styles.inlineChangeRole} 
                onPress={() => navigation.replace('RoleSelection')}
              >
                <Ionicons name="swap-horizontal" size={18} color={B_ORANGE} />
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
                editable={!isOtpSent && !isLoading}
                selectionColor={B_ORANGE}
              />

              {isOtpSent && (
                <View style={{marginTop: 20}}>
                  <Text style={styles.label}>Enter OTP</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="123456" 
                    keyboardType="number-pad" 
                    maxLength={6} 
                    value={otp}
                    onChangeText={setOtp}
                    editable={!isLoading}
                    selectionColor={B_ORANGE}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.mainButton, isLoading && { opacity: 0.8 }]} 
              onPress={handleAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isOtpSent ? "VERIFY & LOGIN" : "SEND OTP"}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('BuyerSignUp')}>
                <Text style={styles.footerText}>New Buyer? <Text style={{fontWeight:'bold', color: B_ORANGE}}>Create Account</Text></Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 30
  },
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
    backgroundColor: '#fff5f2', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe8e3',
  },
  changeRoleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: B_ORANGE,
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