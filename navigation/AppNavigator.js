import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import FarmerHome from '../pages/FarmerPages/FarmerHome'; // Correct for "export default"
import BuyerHome from '../pages/BuyerPages/BuyerHome';

const Tab = createBottomTabNavigator();
const K_GREEN = '#6aaa49';

// --- FARMER NAVIGATION (5 Buttons) ---
export function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: K_GREEN,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Stock') iconName = 'leaf';
          else if (route.name === 'Orders') iconName = 'list-circle';
          else if (route.name === 'History') iconName = 'time';
          else if (route.name === 'Menu') iconName = 'grid';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={FarmerHome} />
      <Tab.Screen name="Stock" component={FarmerHome} />
      <Tab.Screen name="Orders" component={FarmerHome} />
      <Tab.Screen name="History" component={FarmerHome} />
      <Tab.Screen name="Menu" component={FarmerHome} />
    </Tab.Navigator>
  );
}

// --- BUYER NAVIGATION (5 Buttons) ---
export function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: K_GREEN,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Kart') iconName = 'cart';
          else if (route.name === 'Orders') iconName = 'receipt';
          else if (route.name === 'Menu') iconName = 'menu';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={BuyerHome} />
      <Tab.Screen name="Search" component={BuyerHome} />
      <Tab.Screen name="Kart" component={BuyerHome} />
      <Tab.Screen name="Orders" component={BuyerHome} />
      <Tab.Screen name="Menu" component={BuyerHome} />
    </Tab.Navigator>
  );
}