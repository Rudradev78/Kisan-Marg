import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const { width } = Dimensions.get('window');

export default function PersonalInfo({ navigation }) {
  const [name, setName] = useState('Smruti Ranjan');
  const [email, setEmail] = useState('smruti@kisanmarg.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
    navigation.goBack();
  };

  const InfoInput = ({ label, value, onChange, icon, keyboardType = 'default' }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color={K_GREEN} style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          value={value} 
          onChangeText={onChange} 
          keyboardType={keyboardType}
          placeholderTextColor="#bbb"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <Image 
            source={{ uri: 'https://writestylesonline.com/wp-content/uploads/2016/08/Follow-These-Steps-for-a-Flawless-Professional-Profile-Picture.jpg' }} 
            style={styles.bigAvatar} 
          />
          <TouchableOpacity style={styles.cameraBtn}>
            <Feather name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <InfoInput label="Full Name" value={name} onChange={setName} icon="person-outline" />
        <InfoInput label="Email Address" value={email} onChange={setEmail} icon="mail-outline" keyboardType="email-address" />
        <InfoInput label="Phone Number" value={phone} onChange={setPhone} icon="call-outline" keyboardType="phone-pad" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  scrollContent: { padding: 25 },
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  bigAvatar: { width: 120, height: 120, borderRadius: 60 },
  cameraBtn: { position: 'absolute', bottom: 0, right: width / 2 - 60, backgroundColor: K_GREEN, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 10, marginLeft: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#eee' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: K_DARK_BLUE },
  saveBtn: { backgroundColor: K_DARK_BLUE, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});