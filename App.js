import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
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
import AppMenu from './pages/BasicAppPages/AppMenu';
import Language from './pages/BasicAppPages/Language'; 
import AboutApp from './pages/BasicAppPages/AboutApp'; 
import HelpContact from './pages/BasicAppPages/HelpContact';
import AdminChat from './pages/BasicAppPages/AdminChat'; 

/* --- FARMER PAGES IMPORTS --- */
import UploadProduct from './pages/FarmerPages/UploadProduct';
import Stocks from './pages/FarmerPages/Stocks';
import Orders from './pages/FarmerPages/Orders';
import FarmerHistory from './pages/FarmerPages/FarmerHistory';
import FarmerAlertNotificaion from './pages/FarmerPages/FarmerAlertNotificaion';
import FarmerSearch from './pages/FarmerPages/FarmerSearch'; 
import FarmerProfile from './pages/FarmerPages/FarmerProfile'; // <--- NEW

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('RoleSelection');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
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
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right' 
          }}
        >
          {/* --- 1. ENTRY & ROLE SELECTION --- */}
          <Stack.Screen name="RoleSelection" component={RoleSelection} />

          {/* --- 2. AUTH PAGES --- */}
          <Stack.Screen name="FarmerSignIn" component={FarmerSignIn} />
          <Stack.Screen name="FarmerSignUp" component={FarmerSignUp} />
          <Stack.Screen name="BuyerSignIn" component={BuyerSignIn} />
          <Stack.Screen name="BuyerSignUp" component={BuyerSignUp} />

          {/* --- 3. MAIN DASHBOARDS --- */}
          <Stack.Screen name="FarmerHome" component={FarmerTabs} />
          <Stack.Screen name="BuyerHome" component={BuyerTabs} />

          {/* --- 4. FARMER ACTION PAGES --- */}
          <Stack.Screen name="UploadProduct" component={UploadProduct} />
          <Stack.Screen name="Stocks" component={Stocks} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="FarmerHistory" component={FarmerHistory} />
          <Stack.Screen name="FarmerAlertNotificaion" component={FarmerAlertNotificaion} />
          <Stack.Screen name="Search" component={FarmerSearch} /> 
          <Stack.Screen name="FarmerProfile" component={FarmerProfile} /> 

          {/* --- 5. UTILITY & MENU --- */}
          <Stack.Screen name="AppMenu" component={AppMenu} />
          <Stack.Screen name="Language" component={Language} />
          <Stack.Screen name="AboutApp" component={AboutApp} />
          <Stack.Screen name="HelpContact" component={HelpContact} />
          <Stack.Screen name="AdminChat" component={AdminChat} />

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