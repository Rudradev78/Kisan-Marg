import React, { useState, useEffect } from 'react'; // Add useEffect
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  TextInput,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const K_GREEN = '#6aaa49';
const K_DARK_BLUE = '#112244';

export default function HelpContact({ navigation }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I update my crop prices?",
      answer: "Go to your 'Stocks' page from the Farmer Dashboard. Click on the 'Edit' icon next to the product you want to change, enter the new price, and tap 'Save Changes'."
    },
    {
      id: 2,
      question: "Is my payment data secure?",
      answer: "Absolutely. Kisan Marg uses end-to-end encryption for all financial data. We do not store your full bank details on our servers, ensuring your transactions are 100% secure."
    },
    {
      id: 3,
      question: "How to download my sale receipts?",
      answer: "Visit 'Sales History' in your menu. Select the completed order you need a receipt for, click 'View Receipt', and you will find a Download button at the bottom of the popup."
    }
  ];

  const handleContact = (type) => {
    if (type === 'call') Linking.openURL('tel:+919776587878');
    if (type === 'whatsapp') Linking.openURL('whatsapp://send?phone=+917682014546&text=Hello Kisan Marg Support');
    if (type === 'email') Linking.openURL('mailto:drwebdev87878@gmail.com');
  };

  const toggleFaq = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- 1. CLEAN HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={K_DARK_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Center</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- 2. INTRO SECTION --- */}
        <View style={styles.introSection}>
          <Text style={styles.greeting}>How can we help you?</Text>
          <Text style={styles.subGreeting}>Our team is here to support your farming journey.</Text>
          
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput 
              placeholder="Search for help topics..." 
              style={styles.searchInput}
              placeholderTextColor="#bbb"
            />
          </View>
        </View>

        {/* --- 3. CONTACT TILES (2x2 Grid) --- */}
        <View style={styles.tileGrid}>
          <TouchableOpacity style={styles.contactTile} onPress={() => handleContact('call')}>
            <View style={[styles.iconBox, { backgroundColor: '#f0f9eb' }]}>
              <Ionicons name="call" size={26} color={K_GREEN} />
            </View>
            <Text style={styles.tileTitle}>Call Us</Text>
            <Text style={styles.tileSub}>Speak to an agent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactTile} onPress={() => handleContact('whatsapp')}>
            <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}>
              <FontAwesome name="whatsapp" size={30} color="#25D366" />
            </View>
            <Text style={styles.tileTitle}>WhatsApp</Text>
            <Text style={styles.tileSub}>Instant messaging</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactTile} onPress={() => handleContact('email')}>
            <View style={[styles.iconBox, { backgroundColor: '#eef2ff' }]}>
              <Ionicons name="mail" size={26} color="#4f46e5" />
            </View>
            <Text style={styles.tileTitle}>Email</Text>
            <Text style={styles.tileSub}>Send a ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactTile} onPress={() => {
            Alert.alert(
                  "Under Construction!!",
                  `This feature will be added soon. We are sorry for not being able to serve you in this section.`,
                  [{ text: "OK" }]
                );
          }}>
            <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
              <Ionicons name="location" size={26} color="#f97316" />
            </View>
            <Text style={styles.tileTitle}>Offices</Text>
            <Text style={styles.tileSub}>Find us near you</Text>
          </TouchableOpacity>
        </View>

        {/* --- 4. TOP QUESTIONS (FAQs with Answers) --- */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionHeading}>Top Questions</Text>
          
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqWrapper}>
              <TouchableOpacity 
                style={styles.faqItem} 
                onPress={() => toggleFaq(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.faqText, expandedFaq === faq.id && {color: K_GREEN}]}>
                  {faq.question}
                </Text>
                <Ionicons 
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#ccc" 
                />
              </TouchableOpacity>
              
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.timingInfo}>Support available: Mon - Sat (9:00 AM - 6:00 PM)</Text>
        <View style={{ height: 100 }} /> 
      </ScrollView>

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
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE },
  backBtn: { padding: 5 },

  scrollContent: { paddingBottom: 20 },

  introSection: { paddingHorizontal: 25, paddingVertical: 20 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: K_DARK_BLUE },
  subGreeting: { fontSize: 14, color: '#888', marginTop: 5, marginBottom: 20 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f6f6f6', 
    height: 50, 
    borderRadius: 15, 
    paddingHorizontal: 15 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: K_DARK_BLUE },

  tileGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25,
    marginTop: 10
  },
  contactTile: { 
    width: '47%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  tileTitle: { fontSize: 16, fontWeight: 'bold', color: K_DARK_BLUE },
  tileSub: { fontSize: 11, color: '#aaa', marginTop: 4 },

  // FAQ SECTION
  faqSection: { paddingHorizontal: 25, marginTop: 10 },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', color: K_DARK_BLUE, marginBottom: 15 },
  faqWrapper: { borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
  faqItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 18, 
  },
  faqText: { fontSize: 15, color: '#444', fontWeight: '500', flex: 1, paddingRight: 10 },
  faqAnswerContainer: { paddingBottom: 18, paddingRight: 20 },
  faqAnswerText: { fontSize: 14, color: '#777', lineHeight: 20 },

  timingInfo: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 30, fontStyle: 'italic' },

  // FLOATING BUTTON STYLES
  floatingChatBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: K_GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  chatBtnLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8
  }
});