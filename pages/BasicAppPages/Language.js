import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function Language({ navigation }) {
  // Local state to track which language is currently selected
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { id: 'en', name: 'English', subText: 'Default Language' },
    { id: 'hi', name: 'हिन्दी', subText: 'Hindi' },
    { id: 'or', name: 'ଓଡ଼ିଆ', subText: 'Odia' },
    { id: 'bn', name: 'বাংলা', subText: 'Bengali' },
  ];

  const handleLanguageChange = () => {
    const selectedName = languages.find(l => l.id === selectedLang).name;
    Alert.alert(
      "Language Changed",
      `App language has been set to ${selectedName}.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instruction}>
          Choose your preferred language to use the app more comfortably.
        </Text>

        {/* --- LANGUAGE LIST --- */}
        <View style={styles.langList}>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang.id} 
              style={[
                styles.langItem, 
                selectedLang === lang.id && styles.activeLangItem
              ]}
              onPress={() => setSelectedLang(lang.id)}
            >
              <View style={styles.textContainer}>
                <Text style={[
                  styles.langName, 
                  selectedLang === lang.id && styles.activeText
                ]}>
                  {lang.name}
                </Text>
                <Text style={styles.subText}>{lang.subText}</Text>
              </View>

              {/* Custom Radio Button */}
              <View style={[
                styles.radioOuter, 
                selectedLang === lang.id && { borderColor: K_GREEN }
              ]}>
                {selectedLang === lang.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* --- BOTTOM ACTION BUTTON --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.applyBtn} 
          onPress={handleLanguageChange}
        >
          <Text style={styles.applyBtnText}>Apply Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: K_DARK_BLUE },
  backBtn: { padding: 5 },

  scrollContent: { padding: 25 },
  instruction: { 
    fontSize: 15, 
    color: '#666', 
    lineHeight: 22, 
    marginBottom: 30 
  },

  langList: { marginBottom: 20 },
  langItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f1f1'
  },
  activeLangItem: { 
    backgroundColor: '#f0f9eb', 
    borderColor: K_GREEN,
    elevation: 2
  },
  textContainer: { flex: 1 },
  langName: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  activeText: { color: K_GREEN },
  subText: { fontSize: 13, color: '#999', marginTop: 2 },

  radioOuter: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#ccc', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioInner: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: K_GREEN 
  },

  footer: { padding: 25, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
  applyBtn: { 
    backgroundColor: K_DARK_BLUE, 
    height: 55, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4
  },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});