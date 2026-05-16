import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [currentNotif, setCurrentNotif] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false); // 🟢 Gate to prevent splash screen popups
  
  const hideTimerRef = useRef(null);
  const displayedNotifIds = useRef(new Set());

  // Animation Values
  const translateY = useRef(new Animated.Value(-200)).current; 
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // 🟢 Public function to be triggered only when main app dashboards mount
  const startNotificationService = () => {
    setIsReady(true);
  };

  // Poll for notifications every 10 seconds ONLY when the system is declared ready
  useEffect(() => {
    if (!isReady) return;

    // Run an immediate check when entering dashboards
    checkForNewNotifications();

    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [isReady]); 

  const checkForNewNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      
      const unread = res.data.data.find(
        n => !n.isRead && !displayedNotifIds.current.has(n._id)
      );
      
      if (unread) {
        displayedNotifIds.current.add(unread._id);
        triggerPopup(unread);
      }
    } catch (err) {
      console.log("Notif Fetch Error:", err.message);
    }
  };

  const triggerPopup = (notif) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setCurrentNotif(notif);
    setVisible(true);
    
    translateY.setValue(-100);
    translateX.setValue(0);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 60, useNativeDriver: true, bounciness: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();

    hideTimerRef.current = setTimeout(() => {
      hidePopup();
    }, 4000);
  };

  const hidePopup = (toRight = true) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    const finalX = toRight ? 500 : -500;
    
    Animated.timing(translateX, {
      toValue: finalX,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setVisible(false);
      translateX.setValue(0);
      translateY.setValue(-200);
      opacity.setValue(0);
      setCurrentNotif(null);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          hidePopup(gestureState.dx > 0);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    // 🟢 Exposing startNotificationService along with triggerPopup
    <NotificationContext.Provider value={{ triggerPopup, startNotificationService }}>
      {children}
      {visible && currentNotif && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.popup,
            { transform: [{ translateY }, { translateX }], opacity }
          ]}
        >
          <View style={styles.iconBox}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.title} numberOfLines={1}>{currentNotif.title}</Text>
            <Text style={styles.message} numberOfLines={1}>{currentNotif.message}</Text>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    top: 0, 
    left: 15,
    right: 15,
    backgroundColor: '#112244',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 100, 
    zIndex: 99999,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  iconBox: { backgroundColor: '#6aaa49', padding: 8, borderRadius: 10, marginRight: 12 },
  textBox: { flex: 1 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  message: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
});