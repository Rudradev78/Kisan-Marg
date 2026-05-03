import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [currentNotif, setCurrentNotif] = useState(null);
  const [visible, setVisible] = useState(false);
  
  // Timer Reference to prevent the "flicker" glitch
  const hideTimerRef = useRef(null);

  // Animation Values
  const translateY = useRef(new Animated.Value(-200)).current; 
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Poll for notifications every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentNotif]); // Re-run effect if currentNotif changes to avoid stale checks

  const checkForNewNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      const unread = res.data.data.find(n => !n.isRead);
      
      // Only trigger if it's a new ID we haven't shown yet
      if (unread && (!currentNotif || unread._id !== currentNotif._id)) {
        triggerPopup(unread);
      }
    } catch (err) {
      console.log("Notif Fetch Error:", err.message);
    }
  };

  const triggerPopup = (notif) => {
    // 1. Clear any existing timer so the popup doesn't disappear early
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setCurrentNotif(notif);
    setVisible(true);
    
    // 2. Reset Animation Positions for a clean start
    translateY.setValue(-100);
    translateX.setValue(0);
    opacity.setValue(0);

    // 3. Slide Down Animation
    Animated.parallel([
      Animated.spring(translateY, { toValue: 60, useNativeDriver: true, bounciness: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();

    // 4. Set a new timer to hide after 4 seconds
    hideTimerRef.current = setTimeout(() => {
      hidePopup();
    }, 4000);
  };

  const hidePopup = (toRight = true) => {
    // Clear timer when manual hide (swipe) happens
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
      // Reset values for next time
      translateX.setValue(0);
      translateY.setValue(-200);
      opacity.setValue(0);
      setCurrentNotif(null);
    });
  };

  // --- SWIPE LOGIC ---
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
    <NotificationContext.Provider value={{ triggerPopup }}>
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