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
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// IMAGE ASSET PATHS
const VEGETABLE_IMAGE = require('../../assets/Vegetables2.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerSignUp({ navigation }) {
  const [phone, setPhone] = useState('');

  const handleSignUp = () => {
    if (phone.length === 10) {
      // Navigate to Home (In real app, trigger OTP first)
      navigation.replace('FarmerHome');
    } else {
      alert("Please enter a valid 10-digit number");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* TOP SECTION: IMMERSIVE APP-THEMED IMAGE */}
          <View style={styles.headerContainer}>
            <Image source={VEGETABLE_IMAGE} style={styles.headerImage} />
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.4)', K_GREEN]} 
              style={styles.gradientOverlay} 
            />
            <View style={styles.centeredLogoContainer}>
               <Image source={LOGO_WREATH} style={styles.largeLogo} resizeMode="contain" />
            </View>
          </View>

          {/* BOTTOM SECTION: WHITE CARD WITH FORM */}
          <View style={styles.contentCard}>
            
            {/* TITLE ROW WITH INLINE CHANGE ROLE BUTTON */}
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>Farmer Sign Up</Text>
                <Text style={styles.subtitle}>Start your journey today!</Text>
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
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="9876543210" 
                keyboardType="phone-pad" 
                maxLength={10} 
                value={phone}
                onChangeText={setPhone}
                selectionColor={K_GREEN}
              />
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('FarmerSignIn')}>
                <Text style={styles.footerText}>
                  Already have an account? <Text style={{fontWeight:'bold', color: K_GREEN}}>Sign In</Text>
                </Text>
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
    backgroundColor: '#f0f9eb', 
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
  footerLinks: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 15, color: K_DARK_BLUE },
});