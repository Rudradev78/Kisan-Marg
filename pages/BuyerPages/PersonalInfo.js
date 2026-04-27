import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';
const { width } = Dimensions.get('window');

// 🟢 FIX: InfoInput moved OUTSIDE to prevent keyboard from closing on every keystroke
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

export default function PersonalInfo({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- LOGIC: Fetch current user data on visit ---
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const res = await apiClient.get('/auth/stats');
      if (res.data.success) {
        const user = res.data.user;
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phno || '');
        setImageUri(user.dpImageURL || null);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: Select Profile Image ---
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- LOGIC: Save changes to Backend ---
  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert("Required", "Name and Phone Number are mandatory.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phno', phone);

      if (imageUri && imageUri.startsWith('file')) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: type,
        });
      }

      const res = await apiClient.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={K_GREEN} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <Image 
            source={{ uri: imageUri || 'https://via.placeholder.com/150' }} 
            style={styles.bigAvatar} 
          />
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
            <Feather name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <InfoInput label="Full Name" value={name} onChange={setName} icon="person-outline" />
        <InfoInput label="Email Address" value={email} onChange={setEmail} icon="mail-outline" keyboardType="email-address" />
        <InfoInput label="Phone Number" value={phone} onChange={setPhone} icon="call-outline" keyboardType="phone-pad" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
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