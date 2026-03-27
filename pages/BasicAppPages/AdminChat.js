import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Linking,
  Keyboard,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function AdminChat({ navigation }) {
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  // Mock conversation based on your screenshot
  const [chatHistory, setChatHistory] = useState([
    { id: '1', text: "Hello Rajesh! Welcome to Kisan Marg Support. How can we help you today?", sender: 'admin', time: '10:00 AM' },
    { id: '2', text: "I'm having trouble updating my potato prices in the stock section.", sender: 'user', time: '10:02 AM' },
    { id: '3', text: "I can help with that! Are you seeing an error message, or is the save button not responding?", sender: 'admin', time: '10:03 AM' },
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    
    // Auto-scroll to the new message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.adminRow]}>
        {!isUser && (
          <View style={styles.adminAvatarSmall}>
             <MaterialCommunityIcons name="face-agent" size={18} color={K_GREEN} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.adminBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.adminText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser ? styles.userTime : styles.adminTime]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- 1. HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        
        <View style={styles.adminInfo}>
           <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="face-agent" size={26} color="#fff" />
              <View style={styles.onlineStatus} />
           </View>
           <View style={{marginLeft: 12}}>
              <Text style={styles.adminName}>Kisan Marg Support</Text>
              <Text style={styles.adminStatus}>Online | Usually responds in 5m</Text>
           </View>
        </View>

        <TouchableOpacity 
          style={styles.callBtn} 
          onPress={() => Linking.openURL('tel:+919876543210')}
        >
          <Ionicons name="call" size={20} color={K_GREEN} />
        </TouchableOpacity>
      </View>

      {/* --- 2. CHAT AREA --- */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
      >
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* --- 3. INPUT BAR --- */}
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={28} color="#999" />
          </TouchableOpacity>
          
          <TextInput 
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor="#bbb"
          />

          <TouchableOpacity 
            style={[styles.sendBtn, { opacity: message.length > 0 ? 1 : 0.6 }]} 
            onPress={sendMessage}
            disabled={message.length === 0}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 10
  },
  adminInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  avatarContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: K_DARK_BLUE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  onlineStatus: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#4cd137', 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  adminName: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  adminStatus: { fontSize: 11, color: K_GREEN, fontWeight: '600' },
  callBtn: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#f0f9eb', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  chatList: { padding: 15, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  adminRow: { justifyContent: 'flex-start' },
  
  adminAvatarSmall: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8, 
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: K_GREEN, borderBottomRightRadius: 2 },
  adminBubble: { 
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 2, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  
  messageText: { fontSize: 15, lineHeight: 21 },
  userText: { color: '#fff' },
  adminText: { color: K_DARK_BLUE },
  
  timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: 'rgba(255,255,255,0.8)' },
  adminTime: { color: '#bbb' },

  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 0, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0' 
  },
  attachBtn: { marginRight: 8 },
  input: { 
    flex: 1, 
    backgroundColor: '#f1f3f5', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    fontSize: 15, 
    maxHeight: 100,
    color: K_DARK_BLUE
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: K_GREEN, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 8 
  }
});