// import React, { useState, useEffect } from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   Dimensions, 
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
//   Platform 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import apiClient from '../../services/api'; 
// import moment from 'moment';

// const { width } = Dimensions.get('window');
// const K_GREEN = '#6aaa49';
// const K_DARK_BLUE = '#112244';

// // ✅ Correct way to detect Expo Go
// const isExpoGo = Constants.executionEnvironment === 'storeClient';

// // ✅ Only set handler outside Expo Go
// if (!isExpoGo) {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     }),
//   });
// }

// export default function BuyerAlertNotification({ navigation }) {
//   const [activeTab, setActiveTab] = useState('notifications');
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [alerts, setAlerts] = useState([]);
  
//   const [notifications, setNotifications] = useState([
//     { id: '1', title: 'Order Shipped 🚚', body: 'Your order #KM-8821 for Organic Potatoes has been shipped.', time: '10m ago', type: 'order', read: false },
//     { id: '2', title: 'Payment Successful ✅', body: 'Payment of ₹450 received for your latest purchase.', time: '2h ago', type: 'payment', read: true },
//   ]);

//   useEffect(() => {
//     if (!isExpoGo) {
//       registerForPushNotificationsAsync();
//     } else {
//       console.log("🛠️ Expo Go: Notifications disabled safely");
//     }

//     fetchData();
//   }, []);

//   // ✅ SAFE PUSH REGISTRATION
//   async function registerForPushNotificationsAsync() {
//     try {
//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//         });
//       }

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') return;

//       const token = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log("Expo Push Token:", token);

//     } catch (error) {
//       console.log("Notification Error:", error);
//     }
//   }

//   const fetchData = async () => {
//     try {
//       const response = await apiClient.get('/alerts/my-alerts');
//       if (response.data.success) {
//         setAlerts(response.data.data);

//         if (response.data.data.length > 0) {
//           triggerLocalNotification(response.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.log("Fetch Alerts Error:", error.message);
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // ✅ SAFE LOCAL NOTIFICATION
//   const triggerLocalNotification = async (alertData) => {
//     if (isExpoGo) {
//       console.log("🔔 Skipped (Expo Go):", alertData.heading);
//       return;
//     }

//     try {
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: alertData.heading,
//           body: alertData.description,
//         },
//         trigger: null,
//       });
//     } catch (err) {
//       console.log("Local Notification Error:", err);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   const renderNotification = ({ item }) => (
//     <TouchableOpacity 
//         style={[styles.notifCard, !item.read && styles.unreadNotif]} 
//         onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
//     >
//       <View style={[styles.notifIconCircle, { backgroundColor: item.read ? '#f0f0f0' : K_GREEN + '20' }]}>
//         <Ionicons 
//             name={item.type === 'order' ? 'cart' : item.type === 'payment' ? 'card' : 'notifications'} 
//             size={20} 
//             color={item.read ? '#aaa' : K_GREEN} 
//         />
//       </View>
//       <View style={styles.notifContent}>
//         <View style={styles.notifHeader}>
//           <Text style={[styles.notifTitle, !item.read && { fontWeight: 'bold' }]}>{item.title}</Text>
//           <Text style={styles.notifTime}>{item.time}</Text>
//         </View>
//         <Text style={styles.notifBody} numberOfLines={1}>{item.body}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderAlert = ({ item }) => (
//     <TouchableOpacity style={styles.alertCard} activeOpacity={0.9}>
//       <View style={styles.alertImageContainer}>
//         {item.image ? (
//           <Image source={{ uri: item.image }} style={styles.alertImg} />
//         ) : (
//           <View style={[styles.alertImg, styles.placeholderImg]}>
//              <Ionicons name="image-outline" size={50} color="#ccc" />
//           </View>
//         )}
//         <TouchableOpacity style={styles.alertCloseBtn}>
//           <Ionicons name="close" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.alertTextContent}>
//         <View style={styles.alertHeaderRow}>
//             <Text style={styles.alertTitle} numberOfLines={1}>{item.heading}</Text>
//             <Text style={styles.alertTime}>{moment(item.createdAt).fromNow()}</Text>
//         </View>
//         <Text style={styles.alertDesc} numberOfLines={1}>{item.description}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Updates & Alerts</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.tabBar}>
//         <TouchableOpacity 
//             style={[styles.tab, activeTab === 'notifications' && styles.activeTab]} 
//             onPress={() => setActiveTab('notifications')}
//         >
//           <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>Notifications</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//             style={[styles.tab, activeTab === 'alerts' && styles.activeTab]} 
//             onPress={() => setActiveTab('alerts')}
//         >
//           <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>Alerts</Text>
//         </TouchableOpacity>
//       </View>

//       {isLoading ? (
//         <View style={styles.loaderContainer}><ActivityIndicator size="large" color={K_GREEN} /></View>
//       ) : (
//         <FlatList
//           data={activeTab === 'notifications' ? notifications : alerts}
//           renderItem={activeTab === 'notifications' ? renderNotification : renderAlert}
//           keyExtractor={item => item._id || item.id}
//           contentContainerStyle={{ padding: 20 }}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={K_GREEN} />}
//           ListEmptyComponent={<Text style={styles.emptyText}>Nothing to show here</Text>}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
//   tabBar: { flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 4 },
//   tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
//   activeTab: { backgroundColor: '#fff', elevation: 2 },
//   tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
//   activeTabText: { color: K_DARK_BLUE },
//   notifCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5 },
//   unreadNotif: { backgroundColor: '#fafff9', borderRadius: 15, marginHorizontal: -5, paddingHorizontal: 10 },
//   notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
//   notifContent: { flex: 1, marginLeft: 15 },
//   notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
//   notifTitle: { fontSize: 15, color: K_DARK_BLUE },
//   notifTime: { fontSize: 11, color: '#aaa' },
//   notifBody: { fontSize: 13, color: '#777' },
//   alertCard: { backgroundColor: '#fff', borderRadius: 20, height: 320, marginBottom: 25, elevation: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
//   alertImageContainer: { flex: 4 }, 
//   alertImg: { width: '100%', height: '100%' },
//   placeholderImg: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
//   alertCloseBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   alertTextContent: { flex: 1, padding: 15, justifyContent: 'center' }, 
//   alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
//   alertTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, width: '75%' },
//   alertTime: { fontSize: 10, color: '#aaa' },
//   alertDesc: { fontSize: 12, color: '#666' },
//   loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { textAlign: 'center', marginTop: 100, color: '#ccc', fontSize: 16 }
// });



import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/api'; 
import moment from 'moment';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function BuyerAlertNotification({ navigation }) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  // MOCK DATA: Order-related notifications
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Order Shipped 🚚', body: 'Your order #KM-8821 for Organic Potatoes has been shipped.', time: '10m ago', type: 'order', read: false },
    { id: '2', title: 'Payment Successful ✅', body: 'Payment of ₹450 received for your latest purchase.', time: '2h ago', type: 'payment', read: true },
    { id: '3', title: 'Back in Stock! 🌿', body: 'Red Onions from Patanjal Farms are now available.', time: 'Yesterday', type: 'stock', read: true },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
    try {
      // ✅ Change the URL to call the public endpoint with a type filter
      // This matches your backend router.get('/', getAllAlerts)
      const response = await apiClient.get('/alerts?type=Buyer');
      
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.log("Fetch Alerts Error:", error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // --- RENDER NOTIFICATION (Orders) ---
  const renderNotification = ({ item }) => (
    <TouchableOpacity 
        style={[styles.notifCard, !item.read && styles.unreadNotif]} 
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={[styles.notifIconCircle, { backgroundColor: item.read ? '#f0f0f0' : K_GREEN + '20' }]}>
        <Ionicons 
            name={item.type === 'order' ? 'cart' : item.type === 'payment' ? 'card' : 'notifications'} 
            size={20} 
            color={item.read ? '#aaa' : K_GREEN} 
        />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !item.read && { fontWeight: 'bold' }]}>{item.title}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={1}>{item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- RENDER ALERT (Matched to your DB instance) ---
  const renderAlert = ({ item }) => (
    <TouchableOpacity style={styles.alertCard} activeOpacity={0.9}>
      <View style={styles.alertImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.alertImg} />
        ) : (
          <View style={[styles.alertImg, styles.placeholderImg]}>
             <Ionicons name="image-outline" size={50} color="#ccc" />
          </View>
        )}
        <TouchableOpacity style={styles.alertCloseBtn}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.alertTextContent}>
        <View style={styles.alertHeaderRow}>
            {/* Matches "heading" and "createdAt" from your DB image */}
            <Text style={styles.alertTitle} numberOfLines={1}>{item.heading}</Text>
            <Text style={styles.alertTime}>{moment(item.createdAt).fromNow()}</Text>
        </View>
        {/* Matches "description" from your DB image */}
        <Text style={styles.alertDesc} numberOfLines={1}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Updates & Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'notifications' && styles.activeTab]} 
            onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'alerts' && styles.activeTab]} 
            onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>Alerts</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}><ActivityIndicator size="large" color={K_GREEN} /></View>
      ) : (
        <FlatList
          data={activeTab === 'notifications' ? notifications : alerts}
          renderItem={activeTab === 'notifications' ? renderNotification : renderAlert}
          keyExtractor={item => item._id || item.id} // Correctly uses _id for DB items
          contentContainerStyle={{ padding: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={K_GREEN} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nothing to show here</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, marginTop: 10, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: K_DARK_BLUE },
  notifCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 5 },
  unreadNotif: { backgroundColor: '#fafff9', borderRadius: 15, marginHorizontal: -5, paddingHorizontal: 10 },
  notifIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1, marginLeft: 15 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  notifTitle: { fontSize: 15, color: K_DARK_BLUE },
  notifTime: { fontSize: 11, color: '#aaa' },
  notifBody: { fontSize: 13, color: '#777' },
  alertCard: { backgroundColor: '#fff', borderRadius: 20, height: 320, marginBottom: 25, elevation: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  alertImageContainer: { flex: 4 }, 
  alertImg: { width: '100%', height: '100%' },
  placeholderImg: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  alertCloseBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  alertTextContent: { flex: 1, padding: 15, justifyContent: 'center' }, 
  alertHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, width: '75%' },
  alertTime: { fontSize: 10, color: '#aaa' },
  alertDesc: { fontSize: 12, color: '#666' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 100, color: '#ccc', fontSize: 16 }
});