import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. IMPORT YOUR PAGES (Make sure filenames match exactly)
import RoleSelection from './pages/BasicAppPages/RoleSelection';
// Create these empty files in their folders if you haven't yet:
// import FarmerHome from './pages/FarmerPages/FarmerHome';
// import BuyerHome from './pages/BuyerPages/BuyerHome';

const Stack = createNativeStackNavigator();

// Temporary Placeholder for Home Screens until you build them
const PlaceholderHome = ({ route }) => (
  <View style={styles.center}><Text>Welcome {route.name}!</Text></View>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('RoleSelection');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        /*const onboardingComplete = await AsyncStorage.getItem('@onboarding_complete');
        const userRole = await AsyncStorage.getItem('@user_role');

        if (onboardingComplete === 'true') {
          // If they already picked a role, send them to their specific home
          setInitialRoute(userRole === 'Farmer' ? 'FarmerHome' : 'BuyerHome');
        }*/
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* Basic App Pages */}
        <Stack.Screen 
          name="RoleSelection" 
          component={RoleSelection} 
          options={{ headerShown: false }} 
        />

        {/* Farmer Branch */}
        <Stack.Screen name="FarmerHome" component={PlaceholderHome} options={{ title: 'Farmer Dashboard' }} />

        {/* Buyer Branch */}
        <Stack.Screen name="BuyerHome" component={PlaceholderHome} options={{ title: 'Kisan Marg Market' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});