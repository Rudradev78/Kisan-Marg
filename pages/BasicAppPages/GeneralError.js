import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function GeneralError({ navigation, route }) {
  // Capture the error message passed from SplashScreen
  const { errorMsg } = route.params || { errorMsg: 'An unexpected technical error occurred.' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="bug-outline" size={60} color={K_GREEN} />
        </View>
        {/* You can replace the Icon above with a <Image /> or LottieView later */}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={styles.desc}>
          We encountered a glitch while setting up your workspace. 
          Don't worry, your data is safe.
        </Text>
        
        {/* Technical Error Log Box */}
        <View style={styles.errorBox}>
          <Text style={styles.errorLabel}>Error Log:</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.retryBtn} 
          onPress={() => navigation.replace('Splash')}
        >
          <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.retryBtnText}>Restart App</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.supportBtn} 
          onPress={() => navigation.navigate('HelpContact')}
        >
          <Text style={styles.supportBtnText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 30,
    justifyContent: 'center'
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: K_DARK_BLUE,
    textAlign: 'center'
  },
  desc: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 12, 
    lineHeight: 22,
    fontSize: 15
  },
  errorBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginTop: 30,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b'
  },
  errorLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#aaa',
    textTransform: 'uppercase',
    marginBottom: 5
  },
  errorText: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'monospace' // Gives it a "technical" feel
  },
  footer: {
    marginTop: 50,
    width: '100%'
  },
  retryBtn: { 
    backgroundColor: K_GREEN, 
    flexDirection: 'row',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3,
    shadowColor: K_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  retryBtnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
  supportBtn: { 
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center'
  },
  supportBtnText: { 
    color: '#888', 
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});