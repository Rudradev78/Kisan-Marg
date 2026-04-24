import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  TextInput, Dimensions, Alert, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../../services/api';

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function UploadProduct({ navigation }) {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [myPrice, setMyPrice] = useState('');
  const [unit, setUnit] = useState('kg'); // Default unit
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleListProduct = async () => {
    // 1. Check all fields (matching backend variables)
    if (!productName || !qtyAvailable || !myPrice || !image) {
      Alert.alert("Required", "Please fill all fields and select a product image.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // 2. Prepare Image (KEY MUST BE 'image' to match your router)
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', { // <--- Matches upload.single('image')
        uri: image,
        name: filename,
        type,
      });

      // 3. Prepare Body (Matching your Controller destructuring)
      formData.append('productName', productName);
      formData.append('pricePerUnit', myPrice);
      formData.append('availableQuantity', qtyAvailable);
      formData.append('unitGiven', unit);

      // 4. API Call to /products/upload
      const response = await apiClient.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        Alert.alert("Success!", "Product listed successfully", [
          { text: "OK", onPress: () => navigation.navigate('FarmerHome') }
        ]);
      }
    } catch (error) {
      console.log("Upload Error:", error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to list product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload New Crop</Text>
        <View style={{width: 24}}/>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImg} />
            ) : (
              <View style={styles.center}>
                <Ionicons name="camera-reverse-outline" size={50} color={K_GREEN} />
                <Text style={styles.uploadText}>Select Product Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
               <Text style={styles.label}>Product Name</Text>
               <View style={styles.inputRow}>
                 <MaterialCommunityIcons name="leaf" size={20} color={K_GREEN} />
                 <TextInput 
                   style={styles.input} 
                   placeholder="e.g. Fresh Red Tomatoes" 
                   value={productName} 
                   onChangeText={setProductName} 
                 />
               </View>
            </View>

            <View style={styles.splitRow}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput 
                  style={styles.simpleInput} 
                  placeholder="500" 
                  keyboardType="numeric" 
                  value={qtyAvailable} 
                  onChangeText={setQtyAvailable} 
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Unit (kg/q)</Text>
                <TextInput 
                  style={styles.simpleInput} 
                  placeholder="kg" 
                  value={unit} 
                  onChangeText={setUnit} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>Price per unit (₹)</Text>
               <View style={styles.inputRow}>
                 <Text style={{fontWeight:'bold', color: K_GREEN, marginRight: 5}}>₹</Text>
                 <TextInput 
                   style={styles.input} 
                   placeholder="45.00" 
                   keyboardType="numeric" 
                   value={myPrice} 
                   onChangeText={setMyPrice} 
                 />
               </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleListProduct} disabled={isLoading}>
              <LinearGradient colors={[K_GREEN, '#4caf50']} style={styles.gradient}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>LIST PRODUCT</Text>}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  scrollContent: { padding: 20 },
  imageBox: { width: '100%', height: 220, backgroundColor: '#fff', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 25 },
  fullImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadText: { color: '#aaa', marginTop: 10, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 3 },
  label: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 8 },
  inputGroup: { marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee', borderRadius: 15, paddingHorizontal: 15 },
  input: { flex: 1, height: 50, fontSize: 15, color: K_DARK_BLUE },
  splitRow: { flexDirection: 'row', marginBottom: 20 },
  simpleInput: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee', borderRadius: 15, height: 50, paddingHorizontal: 15, fontSize: 15 },
  btn: { height: 60, borderRadius: 15, overflow: 'hidden', marginTop: 10 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  center: { alignItems: 'center' }
});