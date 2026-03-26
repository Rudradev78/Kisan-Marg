import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  Image, TextInput, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function FarmerProfile({ navigation }) {
  const [farmName, setFarmName] = useState('Rajesh Organic Farms');
  const [address, setAddress] = useState('At/Po: Gopinathpur, Dist: Puri, Odisha');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => Alert.alert("Success", "Profile updated!")}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. IDENTITY HEADER */}
        <View style={styles.identitySection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editPhotoBtn}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.farmerName}>Rajesh Kumar</Text>
            <MaterialCommunityIcons name="check-decagram" size={20} color={K_GREEN} />
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}><Text style={styles.statVal}>4.8 ⭐</Text><Text style={styles.statLab}>Rating</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}><Text style={styles.statVal}>5+ Yrs</Text><Text style={styles.statLab}>Exp</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}><Text style={styles.statVal}>150+</Text><Text style={styles.statLab}>Sales</Text></View>
          </View>
        </View>

        {/* 2. BUSINESS DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput style={styles.input} value={farmName} onChangeText={setFarmName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Address</Text>
            <TextInput 
              style={[styles.input, { height: 80 }]} 
              multiline 
              value={address} 
              onChangeText={setAddress} 
            />
          </View>
          <TouchableOpacity style={styles.locationBtn}>
            <Ionicons name="location-outline" size={20} color={K_GREEN} />
            <Text style={styles.locationBtnText}>Set Farm Location on Map</Text>
          </TouchableOpacity>
        </View>

        {/* 3. AGRICULTURAL EXPERTISE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <Text style={styles.label}>Primary Crops</Text>
          <View style={styles.chipRow}>
            {['Potato', 'Tomato', 'Onion', 'Chilli'].map(crop => (
              <View key={crop} style={styles.chip}><Text style={styles.chipText}>{crop}</Text></View>
            ))}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farming Method</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity style={[styles.methodBtn, { backgroundColor: K_GREEN }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Organic</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.methodBtn}>
                <Text style={{ color: '#666' }}>Natural</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. LOGISTICS & CONTACT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logistics</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Accepted Payments</Text>
            <Text style={styles.valueText}>UPI, Cash, Bank Transfer</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={styles.valueText}>+91 98765 43210 (Verified)</Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  saveBtn: { color: K_GREEN, fontWeight: 'bold', fontSize: 16 },
  identitySection: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fcfcfc' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: K_GREEN, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  farmerName: { fontSize: 22, fontWeight: 'bold', color: K_DARK_BLUE, marginRight: 5 },
  statsRow: { flexDirection: 'row', marginTop: 20, width: '90%', justifyContent: 'space-around', backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 2 },
  statBox: { alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  statLab: { fontSize: 12, color: '#aaa', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#eee' },
  section: { padding: 20, borderTopWidth: 8, borderTopColor: '#f9f9f9' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, color: '#aaa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#f6f6f6', borderRadius: 12, padding: 15, fontSize: 15, color: K_DARK_BLUE },
  locationBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWeight: 1, borderColor: K_GREEN, borderStyle: 'dashed', borderWidth: 1 },
  locationBtnText: { color: K_GREEN, marginLeft: 10, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  chip: { backgroundColor: '#f0f9eb', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
  chipText: { color: K_GREEN, fontSize: 13, fontWeight: '600' },
  methodRow: { flexDirection: 'row' },
  methodBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#f6f6f6', marginRight: 10 },
  valueText: { fontSize: 16, color: K_DARK_BLUE, fontWeight: '500' }
});