import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// --- SHARED / COMMON PAGES ---
import AppMenu from '../pages/BasicAppPages/AppMenu';

// --- BUYER PAGES ---
import BuyerHome from '../pages/BuyerPages/BuyerHome';
import BuyerSearch from '../pages/BuyerPages/BuyerSearch';
import Kart from '../pages/BuyerPages/Kart';
import BuyerOrders from '../pages/BuyerPages/BuyerOrders';

// --- FARMER PAGES ---
import FarmerHome from '../pages/FarmerPages/FarmerHome';
import Stocks from '../pages/FarmerPages/Stocks';
import Orders from '../pages/FarmerPages/Orders';
import FarmerHistory from '../pages/FarmerPages/FarmerHistory';

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
      <Tab.Screen name="Stock" component={Stocks} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="History" component={FarmerHistory} />
      <Tab.Screen 
        name="Menu" 
        component={AppMenu} 
        initialParams={{ userRole: 'farmer' }} // 🟢 Fixes the role in AppMenu
      />
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
      <Tab.Screen name="Search" component={BuyerSearch} />
      <Tab.Screen name="Kart" component={Kart} />
      <Tab.Screen name="Orders" component={BuyerOrders} />
      <Tab.Screen 
        name="Menu" 
        component={AppMenu} 
        initialParams={{ userRole: 'buyer' }} // 🟢 Fixes the role in AppMenu
      />
    </Tab.Navigator>
  );
}