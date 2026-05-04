import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './context/NotificationContext';

/* --- NAVIGATION IMPORTS --- */
import { FarmerTabs, BuyerTabs } from './navigation/AppNavigator';

/* --- BASIC APP PAGES IMPORTS --- */
import SplashScreen from './pages/BasicAppPages/SplashScreen';
import NetworkError from './pages/BasicAppPages/NetworkError';
import GeneralError from './pages/BasicAppPages/GeneralError';
import RoleSelection from './pages/BasicAppPages/RoleSelection';
import FarmerSignIn from './pages/BasicAppPages/FarmerSignIn';
import FarmerSignUp from './pages/BasicAppPages/FarmerSignUp';
import BuyerSignIn from './pages/BasicAppPages/BuyerSignIn';
import BuyerSignUp from './pages/BasicAppPages/BuyerSignUp';
import AppMenu from './pages/BasicAppPages/AppMenu';
import Language from './pages/BasicAppPages/Language'; 
import AboutApp from './pages/BasicAppPages/AboutApp'; 
import HelpContact from './pages/BasicAppPages/HelpContact';
import PrivacyPolicy from './pages/BasicAppPages/PrivacyPolicy'; 
import NotificationScreen from './screens/NotificationScreen'; 

/* --- FARMER PAGES IMPORTS --- */
import UploadProduct from './pages/FarmerPages/UploadProduct';
import Stocks from './pages/FarmerPages/Stocks';
import Orders from './pages/FarmerPages/Orders';
import FarmerHistory from './pages/FarmerPages/FarmerHistory';
import FarmerAlertNotification from './pages/FarmerPages/FarmerAlertNotification';
import FarmerSearch from './pages/FarmerPages/FarmerSearch'; 
import FarmerProfile from './pages/FarmerPages/FarmerProfile';

/* --- BUYER PAGES IMPORTS --- */
import ProductDetails from './pages/BuyerPages/ProductDetails';
import Kart from './pages/BuyerPages/Kart';
import BuyerOrders from './pages/BuyerPages/BuyerOrders';
import OrderDetails from './pages/BuyerPages/OrderDetails';
import BuyerAlertNotification from './pages/BuyerPages/BuyerAlertNotification';
import BuyerSearch from './pages/BuyerPages/BuyerSearch'; 
import BuyerProfile from './pages/BuyerPages/BuyerProfile'; 
import PlaceOrder from './pages/BuyerPages/PlaceOrder';
import Payment from './pages/BuyerPages/Payment';
import OrderSuccess from './pages/BuyerPages/OrderSuccess';
import Wishlist from './pages/BuyerPages/Wishlist';
import SavedAddresses from './pages/BuyerPages/SavedAddresses';
import PersonalInfo from './pages/BuyerPages/PersonalInfo';
import PaymentsRefunds from './pages/BuyerPages/PaymentsRefunds';
import RazorpayWebView from './screens/RazorpayWebView';

const Stack = createNativeStackNavigator();

export default function App() {
  // Logic removed from here because SplashScreen now handles 
  // the network check and storage fetching!

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <NotificationProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash" // 🟢 Use a string "Splash" here
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right' 
            }}
          >
            {/* --- 1. ENTRY & ROLE SELECTION --- */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="NetworkError" component={NetworkError} />
            <Stack.Screen name="GeneralError" component={GeneralError} />
            <Stack.Screen name="RoleSelection" component={RoleSelection} />

            {/* --- 2. AUTH PAGES --- */}
            <Stack.Screen name="FarmerSignIn" component={FarmerSignIn} />
            <Stack.Screen name="FarmerSignUp" component={FarmerSignUp} />
            <Stack.Screen name="BuyerSignIn" component={BuyerSignIn} />
            <Stack.Screen name="BuyerSignUp" component={BuyerSignUp} />

            {/* --- 3. MAIN DASHBOARDS (TABS) --- */}
            <Stack.Screen name="FarmerHome" component={FarmerTabs} />
            <Stack.Screen name="BuyerHome" component={BuyerTabs} />

            {/* --- 4. FARMER ACTION PAGES --- */}
            <Stack.Screen name="UploadProduct" component={UploadProduct} />
            <Stack.Screen name="Stocks" component={Stocks} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="FarmerHistory" component={FarmerHistory} />
            <Stack.Screen name="FarmerAlertNotification" component={FarmerAlertNotification} />
            <Stack.Screen name="FarmerSearch" component={FarmerSearch} /> 
            <Stack.Screen name="FarmerProfile" component={FarmerProfile} /> 
            
            {/* --- 5. BUYER ACTION PAGES --- */}
            <Stack.Screen name="Kart" component={Kart} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="BuyerOrders" component={BuyerOrders} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="BuyerAlertNotification" component={BuyerAlertNotification} />
            <Stack.Screen name="BuyerSearch" component={BuyerSearch} /> 
            <Stack.Screen name="BuyerProfile" component={BuyerProfile} /> 
            <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
            <Stack.Screen name="PaymentsRefunds" component={PaymentsRefunds} />

            {/* --- RAZORPAY --- */}
            <Stack.Screen 
              name="RazorpayWebView" 
              component={RazorpayWebView} 
              options={{ gestureEnabled: false }} 
            />

            {/* --- 6. UTILITY & COMMON --- */}
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="AppMenu" component={AppMenu} />
            <Stack.Screen name="Language" component={Language} />
            <Stack.Screen name="AboutApp" component={AboutApp} />
            <Stack.Screen name="HelpContact" component={HelpContact} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}