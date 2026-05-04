import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';

// 🟢 Use your actual logo asset
const LOGO_WREATH = require('../../assets/App-logo.png');


export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }).start();

    const prepareApp = async () => {
      const startTime = Date.now();

      try {
        // Point 8: Check Internet
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          navigation.replace('NetworkError');
          return;
        }

        // Point 2: Fetch Storage
        const userData = await AsyncStorage.getItem('userData');
        let destination = 'RoleSelection';
        let params = {}; // Container for our userId

        if (userData) {
          const { userType, userId } = JSON.parse(userData);

          // Points 4 & 5: Farmer Logic
          if (userType === 'Farmer') {
            if (!userId) {
              destination = 'FarmerSignIn';
            } else {
              destination = 'FarmerHome';
              params = { userId: userId }; // 🟢 Attach userId here
            }
          } 
          // Points 6 & 7: Buyer Logic
          else if (userType === 'Buyer') {
            if (!userId) {
              destination = 'BuyerSignIn';
            } else {
              destination = 'BuyerHome';
              params = { userId: userId }; // 🟢 Attach userId here
            }
          }
        }

        // Point 1: 5 Second Wait
        const waitTime = Math.max(0, 5000 - (Date.now() - startTime));

        setTimeout(() => {
          // 🟢 Pass the params during navigation
          navigation.replace(destination, params);
        }, waitTime);

      } catch (error) {
        navigation.replace('GeneralError');
      }
    };
    prepareApp();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image source={LOGO_WREATH} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={K_GREEN} />
        <Text style={styles.loadingText}>Loading Kisan Marg...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: K_GREEN, justifyContent: 'center', alignItems: 'center' },
  logo: { width: width * 0.5, height: width * 0.5 },
  loaderContainer: { position: 'absolute', bottom: 60, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#ffffff', fontSize: 12 }
});