import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function UploadProduct({ navigation }) {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [minQty, setMinQty] = useState('');
  const [myPrice, setMyPrice] = useState('');
  
  const marketPrice = "45.00"; 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleListProduct = () => {
    if (!productName || !qtyAvailable || !myPrice || !image) {
      Alert.alert("Missing Info", "Please fill all fields and upload a product photo.");
      return;
    }
    
    Alert.alert(
      "Success!", 
      `${productName} has been listed on the market.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Product</Text>
        <View style={{width: 40}} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 1. IMAGE UPLOAD SECTION */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionLabel}>Product Image</Text>
            <TouchableOpacity style={styles.imagePickerBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderBox}>
                  <Ionicons name="camera-outline" size={40} color={K_GREEN} />
                  <Text style={styles.placeholderText}>Tap to upload crop photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 2. FORM SECTION */}
          <View style={styles.formCard}>
            
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="leaf" size={20} color={K_GREEN} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Fresh Red Tomatoes" 
                  value={productName}
                  onChangeText={setProductName}
                />
              </View>
            </View>

            {/* Quantities Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Qty Available (kg/q)</Text>
                <TextInput 
                  style={styles.inputSimple} 
                  placeholder="500" 
                  keyboardType="numeric"
                  value={qtyAvailable}
                  onChangeText={setQtyAvailable}
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Min. Order Qty</Text>
                <TextInput 
                  style={styles.inputSimple} 
                  placeholder="10" 
                  keyboardType="numeric"
                  value={minQty}
                  onChangeText={setMinQty}
                />
              </View>
            </View>

            {/* Pricing Section */}
            <View style={styles.priceContainer}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
                <Text style={styles.label}>Your Price /Unit</Text>
                <View style={[styles.inputWrapper, {borderColor: K_GREEN}]}>
                  <Text style={styles.currency}>₹</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="0.00" 
                    keyboardType="numeric"
                    value={myPrice}
                    onChangeText={setMyPrice}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Market Price (Ref)</Text>
                <View style={styles.readOnlyBox}>
                  <Text style={styles.currencyDark}>₹</Text>
                  <Text style={styles.readOnlyText}>{marketPrice}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.infoNote}>
              * Market price is updated daily based on local Mandi rates.
            </Text>

            {/* LIST BUTTON */}
            <TouchableOpacity style={styles.listButton} onPress={handleListProduct}>
              <LinearGradient 
                colors={[K_GREEN, '#4caf50']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}} 
                style={styles.gradientBtn}
              >
                <Text style={styles.listBtnText}>LIST PRODUCT FOR SALE</Text>
                <Ionicons name="checkmark-circle" size={22} color="#fff" style={{marginLeft: 10}} />
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  backBtn: { padding: 5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  imageSection: { marginBottom: 25 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: K_DARK_BLUE, marginBottom: 12 },
  imagePickerBox: { 
    width: '100%', 
    height: 200, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#eee', 
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  placeholderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 10, color: '#aaa', fontSize: 14 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  formCard: { 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    padding: 20, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 12, 
    paddingHorizontal: 15,
    backgroundColor: '#fafafa'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 15, color: K_DARK_BLUE },
  inputSimple: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    fontSize: 15, 
    backgroundColor: '#fafafa',
    color: K_DARK_BLUE 
  },
  row: { flexDirection: 'row' },
  
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 16, fontWeight: 'bold', color: K_GREEN, marginRight: 5 },
  currencyDark: { fontSize: 16, fontWeight: 'bold', color: '#aaa', marginRight: 5 },
  
  readOnlyBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 50, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    backgroundColor: '#f0f0f0', 
  },
  readOnlyText: { fontSize: 16, fontWeight: '700', color: '#888' },

  infoNote: { fontSize: 11, color: '#aaa', fontStyle: 'italic', marginBottom: 30 },

  listButton: { width: '100%', height: 60, borderRadius: 15, overflow: 'hidden', elevation: 5 },
  gradientBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  listBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});