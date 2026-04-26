import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Image, TextInput, Alert, StatusBar, ActivityIndicator, Modal, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerProfile({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    farmName: '',
    businessAddress: '',
    location: '',
    dpImageURL: '',
    rating: 0,
    experience: '0',
    totalSales: 0,
    phno: '',
    locationCoords: null
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/auth/stats');

      if (res?.data?.success && res?.data?.user) {
        const userData = res.data.user;

        setProfile((prev) => ({
          ...prev,
          ...userData,
        }));

        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      } else {
        throw new Error("Invalid API response");
      }

    } catch (err) {
      try {
        const stored = await AsyncStorage.getItem('userData');

        if (stored) {
          const parsed = JSON.parse(stored);

          setProfile((prev) => ({
            ...prev,
            ...parsed,
          }));
        }

      } catch (cacheErr) {}

    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (!isEditing) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfile((prev) => ({
        ...prev,
        dpImageURL: result.assets[0].uri
      }));
    }
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();

      formData.append('name', profile.name || '');
      formData.append('farmName', profile.farmName || '');
      formData.append('businessAddress', profile.businessAddress || '');
      formData.append('location', profile.location || '');

      if (profile.locationCoords) {
        formData.append('locationCoords', JSON.stringify(profile.locationCoords));
      }

      if (profile.dpImageURL && profile.dpImageURL.startsWith('file')) {
        const filename = profile.dpImageURL.split('/').pop();

        formData.append('image', {
          uri: profile.dpImageURL,
          name: filename,
          type: 'image/jpeg',
        });
      }

      const res = await apiClient.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        setProfile((prev) => ({
          ...prev,
          ...updatedUser
        }));

        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

        setIsEditing(false);
        Alert.alert("Success", "Profile updated!");
      }

    } catch (err) {
      Alert.alert("Error", "Could not save profile changes.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={K_GREEN}/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
          {updating ? (
            <ActivityIndicator size="small" color={K_GREEN} />
          ) : (
            <Text style={styles.saveBtn}>{isEditing ? "Save" : "Edit"}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.identitySection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
            <Image 
              source={{ uri: profile.dpImageURL || 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            {isEditing && (
              <View style={styles.editPhotoBtn}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.nameRow}>
            {isEditing ? (
              <TextInput 
                style={styles.nameInput} 
                value={profile.name || ''} 
                onChangeText={(t) => setProfile({...profile, name: t})} 
              />
            ) : (
              <Text style={styles.farmerName}>{profile.name}</Text>
            )}
            <MaterialCommunityIcons name="check-decagram" size={20} color={K_GREEN} />
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{profile.rating} ⭐</Text>
              <Text style={styles.statLab}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{profile.experience || 0}+ Yrs</Text>
              <Text style={styles.statLab}>Exp</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{profile.totalSales || 0}+</Text>
              <Text style={styles.statLab}>Sales</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.readOnlyInput]} 
              editable={isEditing}
              value={profile.farmName || ''} 
              onChangeText={(t) => setProfile({...profile, farmName: t})} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Address</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.readOnlyInput, { height: 80 }]} 
              multiline 
              editable={isEditing}
              value={profile.businessAddress || ''} 
              onChangeText={(t) => setProfile({...profile, businessAddress: t})} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farm Location</Text>
            <TextInput 
              style={[styles.input, !isEditing && styles.readOnlyInput]} 
              editable={isEditing}
              value={profile.location || ''} 
              onChangeText={(t) => setProfile({...profile, location: t})} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logistics & Contact</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Accepted Payments</Text>
            <Text style={styles.valueText}>UPI, Cash, Bank Transfer</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verified Contact</Text>
            <Text style={styles.valueText}>+91 {profile.phno}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Security</Text>
          <TouchableOpacity 
            style={styles.legalBtn} 
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.legalIconBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color={K_GREEN} />
            </View>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Kisan Marg v1.0.4</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  saveBtn: { color: K_GREEN, fontWeight: 'bold', fontSize: 16 },
  identitySection: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fcfcfc' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: K_GREEN, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  farmerName: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE, marginRight: 5 },
  nameInput: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE, borderBottomWidth: 1, borderBottomColor: K_GREEN, minWidth: 150, textAlign: 'center' },
  statsRow: { flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-around', backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 2 },
  statBox: { alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  statLab: { fontSize: 12, color: '#aaa', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#eee' },
  section: { padding: 20, borderTopWidth: 8, borderTopColor: '#f9f9f9' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, color: '#aaa', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#f6f6f6', borderRadius: 12, padding: 15, fontSize: 15, color: K_DARK_BLUE, borderWidth: 1, borderColor: '#eee' },
  readOnlyInput: { backgroundColor: 'transparent', borderWidth: 0, paddingLeft: 0, color: '#555' },
  valueText: { fontSize: 16, color: K_DARK_BLUE, fontWeight: '500' },
  legalBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#f0f0f0' },
  legalIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f9eb', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  legalText: { flex: 1, fontSize: 15, fontWeight: '600', color: K_DARK_BLUE },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 10, marginTop: 20 }
});