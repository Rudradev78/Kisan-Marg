import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// IMAGE ASSET PATHS (Updated filenames as per your provided code)
const VEGETABLE_IMAGE = require('../../assets/Vegetables.png');
const LOGO_WREATH = require('../../assets/App-logo.png');

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function RoleSelection({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelection = async () => {
    if (!selectedRole) return;

    try {
      // Save data so the app remembers this for next time
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      await AsyncStorage.setItem('@user_role', selectedRole);

      // Navigate to the correct home screen based on role
      if (selectedRole === 'Farmer') {
        navigation.replace('FarmerSignIn');
      } else {
        navigation.replace('BuyerSignIn');
      }

    } catch (e) {
      console.error("Error saving role", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section: The Image Header with Wave */}
      <View style={styles.headerContainer}>
        <Image source={VEGETABLE_IMAGE} style={styles.headerImage} />
        
        {/* Adds contrast so the logo stands out */}
        <LinearGradient 
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', K_GREEN]} 
          style={styles.gradientOverlay} 
        />
        
        {/* NEW: Logo centered directly on the image */}
        <View style={styles.centeredLogoContainer}>
           <Image source={LOGO_WREATH} style={styles.largeLogo} resizeMode="contain" />
        </View>
      </View>

      {/* Bottom Section: White Card with Selection */}
      <View style={styles.contentCard}>
        <Text style={styles.welcomeText}>Welcome to Kisan Marg</Text>
        <Text style={styles.subText}>Please select your role to continue</Text>

        <View style={styles.roleContainer}>
          {/* Farmer Option */}
          <TouchableOpacity 
            style={[styles.roleBox, selectedRole === 'Farmer' && styles.selectedBox]}
            onPress={() => setSelectedRole('Farmer')}
          >
            <Text style={styles.icon}>🚜</Text>
            <Text style={styles.roleTitle}>Farmer</Text>
            <Text style={styles.roleDesc}>Sell your fresh products</Text>
          </TouchableOpacity>

          {/* User Option */}
          <TouchableOpacity 
            style={[styles.roleBox, selectedRole === 'User' && styles.selectedBox]}
            onPress={() => setSelectedRole('User')}
          >
            <Text style={styles.icon}>🛒</Text>
            <Text style={styles.roleTitle}>Normal User</Text>
            <Text style={styles.roleDesc}>Buy fresh from farms</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.mainButton, !selectedRole && styles.disabledButton]} 
          onPress={handleSelection}
          disabled={!selectedRole}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: K_GREEN,
  },
  headerContainer: {
    height: '45%',
    width: '100%',
    // Ensure absolute children (the logo) are constrained here
    position: 'relative', 
    justifyContent: 'center', // Centers children vertically
    alignItems: 'center',     // Centers children horizontally
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0, // Changed from bottom to top to cover the image better
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // CHANGED: Removed the 'logoCircle' badge style.
  // NEW: A container specifically for centering the logo over the image
  centeredLogoContainer: {
    position: 'absolute',
    // These four lines ensure perfect centering
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // NEW: Significantly larger logo size
  largeLogo: {
    width: 250,  
    height: 250, 
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40, // Reduced padding since the badge z-index is gone
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: K_DARK_BLUE,
  },
  subText: {
    fontSize: 15,
    color: '#777',
    marginTop: 5,
    marginBottom: 30,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  roleBox: {
    width: '47%',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
  },
  selectedBox: {
    borderColor: K_GREEN,
    backgroundColor: '#f0f9eb',
  },
  icon: {
    fontSize: 35,
    marginBottom: 10,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: K_DARK_BLUE,
  },
  roleDesc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  mainButton: {
    backgroundColor: K_DARK_BLUE,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});