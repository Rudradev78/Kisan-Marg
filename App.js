import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* --- NAVIGATION IMPORTS --- */
import { FarmerTabs, BuyerTabs } from './navigation/AppNavigator';

/* --- BASIC APP PAGES IMPORTS --- */
import RoleSelection from './pages/BasicAppPages/RoleSelection';
import FarmerSignIn from './pages/BasicAppPages/FarmerSignIn';
import FarmerSignUp from './pages/BasicAppPages/FarmerSignUp';
import BuyerSignIn from './pages/BasicAppPages/BuyerSignIn';
import BuyerSignUp from './pages/BasicAppPages/BuyerSignUp';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('RoleSelection');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        /* --- ALGORITHM TURNED OFF FOR TESTING ---
        const onboardingComplete = await AsyncStorage.getItem('@onboarding_complete');
        const userRole = await AsyncStorage.getItem('@user_role');

        if (onboardingComplete === 'true') {
          setInitialRoute(userRole === 'Farmer' ? 'FarmerHome' : 'BuyerHome');
        }
        ------------------------------------------ */
        
        // STAY ON ROLE SELECTION DURING UI DESIGN
        setInitialRoute('RoleSelection');

      } catch (e) {
        console.log("Error reading storage", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6aaa49" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          
          {/* 1. ENTRY & ROLE SELECTION */}
          <Stack.Screen 
            name="RoleSelection" 
            component={RoleSelection} 
            options={{ headerShown: false }} 
          />

          {/* 2. FARMER AUTH PAGES */}
          <Stack.Screen 
            name="FarmerSignIn" 
            component={FarmerSignIn} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FarmerSignUp" 
            component={FarmerSignUp} 
            options={{ headerShown: false }} 
          />

          {/* 3. BUYER AUTH PAGES */}
          <Stack.Screen 
            name="BuyerSignIn" 
            component={BuyerSignIn} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="BuyerSignUp" 
            component={BuyerSignUp} 
            options={{ headerShown: false }} 
          />

          {/* 4. MAIN DASHBOARDS (TAB NAVIGATORS) */}
          <Stack.Screen 
            name="FarmerHome" 
            component={FarmerTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="BuyerHome" 
            component={BuyerTabs} 
            options={{ headerShown: false }} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});