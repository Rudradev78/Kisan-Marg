import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function OrderSuccess({ navigation, route }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const orderData = route.params?.orderData;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ConfettiCannon 
        count={200} 
        origin={{x: width / 2, y: -20}} 
        fadeOut={true}
        colors={[K_GREEN, K_DARK_BLUE, '#f39c12', '#e74c3c']}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={60} color="#fff" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSub}>
            Your fresh harvest is being prepared.{"\n"}
            Thank you for supporting local farmers!
          </Text>
          
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdValue}>{orderData?.id || "#KM-992834"}</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.trackBtn}
          onPress={() => {
            navigation.navigate('OrderDetails', { order: orderData });
          }}
        >
          <Text style={styles.trackText}>Track Order</Text>
          <Ionicons name="location-outline" size={18} color="#fff" style={{marginLeft: 10}} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('BuyerHome')}
        >
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  checkCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: K_GREEN, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 30, 
    elevation: 10,
    shadowColor: K_GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  successTitle: { fontSize: 28, fontWeight: '900', color: K_DARK_BLUE, marginBottom: 10 },
  successSub: { fontSize: 15, color: '#777', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  orderIdBox: { 
    backgroundColor: '#f9f9f9', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 15, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  orderIdLabel: { fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 },
  orderIdValue: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginTop: 2 },
  footer: { padding: 25 },
  trackBtn: { 
    backgroundColor: K_DARK_BLUE, 
    padding: 18, 
    borderRadius: 18, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4 
  },
  trackText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  homeBtn: { marginTop: 15, padding: 15, alignItems: 'center' },
  homeText: { color: K_GREEN, fontWeight: 'bold', fontSize: 14 }
});