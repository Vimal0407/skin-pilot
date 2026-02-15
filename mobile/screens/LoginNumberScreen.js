import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const countryCodes = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
];

export default function PhoneLoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your phone number');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms & Conditions');
      return;
    }

    // Button animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'OTP Sent!',
        `We've sent a verification code to ${selectedCountry.code} ${phoneNumber}`,
        [{ text: 'OK', onPress: () => console.log('Proceed to OTP screen') }]
      );
    }, 1500);
  };

  const handleSocialLogin = (platform) => {
    if (platform === 'Google'){
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).then(()=>{
        Alert.alert('Success','Signed in with Google');
        navigation && navigation.navigate('Onboarding');
      }).catch(e=>Alert.alert('Google sign-in error', e.message));
      return;
    }
    Alert.alert(`Continue with ${platform}`, `You'll be redirected to ${platform} for authentication`);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  const CountryPickerModal = () => (
    <Modal
      visible={showCountryPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={countryCodes}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => selectCountry(item)}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </View>
                {selectedCountry.code === item.code && (
                  <Ionicons name="checkmark" size={20} color="#4cd964" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#f5e8e8', '#e9f8f8', '#e7f7fb']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            
            {/* Header Section */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#d94c4c', '#5ac8fa']}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoText}>SP</Text>
              </LinearGradient>
              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>Skin Pilot</Text>
                <Text style={styles.brandTagline}>Your Health & Skin care Companion</Text>
              </View>
            </View>

            {/* Main Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Transform your skin with personalized guidance</Text>
              <Text style={styles.subTitle}>
                Join millions of users who have achieved their skin care and glowing skin goals with our AI-powered nutrition and workout plans.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="stats-chart" size={20} color="#d94c4c" />
                </View>
                <Text style={styles.featureText}>Track your nutrition and skin remedy</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons name="robot" size={20} color="#4cd4d9" />
                </View>
                <Text style={styles.featureText}>AI-powered personalized plans</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="people" size={20} color="#d94c4c" />
                </View>
                <Text style={styles.featureText}>Connect with certified dermotologist doctors</Text>
              </View>
            </View>

            {/* Login Form Card */}
            <LinearGradient
              colors={['#FFFFFF', '#F8FFFB']}
              style={styles.loginCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Login to your account</Text>
                <Text style={styles.cardSubtitle}>Enter your phone number to continue</Text>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <View style={styles.phoneInputWrapper}>
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
                    <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                    <Feather name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#AAA"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={15}
                  />
                </View>
              </View>

              {/* Terms & Conditions */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                </View>
                <Text style={styles.termsText}>
                  By signing in, I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and acknowledge that I have read the <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#d94c4c', '#5ac8fa']}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <View style={styles.buttonContent}>
                        <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.loginButtonText}>SENDING OTP...</Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons name="phone-portrait" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.loginButtonText}>LOGIN WITH PHONE</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or connect with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="google" size={18} color="#DB4437" />
                  <Text style={[styles.socialButtonText, styles.googleText]}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('Facebook')}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="facebook-f" size={18} color="#1877F2" />
                  <Text style={[styles.socialButtonText, styles.facebookText]}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.emailButton]}
                  onPress={() => handleSocialLogin('Email')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="email" size={18} color="#333" />
                  <Text style={[styles.socialButtonText, styles.emailText]}>Email</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don't have an account? <Text style={styles.footerLink} onPress={() => navigation && navigation.navigate('SignupEmail')}>Create your account</Text>
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>

        {/* Country Picker Modal */}
        <CountryPickerModal />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4cd964',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  brandInfo: {
    marginLeft: 15,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  brandTagline: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  titleContainer: {
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    lineHeight: 34,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  loginCard: {
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.1)',
  },
  cardHeader: {
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 25,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 18,
    backgroundColor: '#F8F9FA',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 18,
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 3,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4cd964',
    borderColor: '#4cd964',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#4cd964',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
  },
  loginButtonDisabled: {
    opacity: 0.8,
  },
  loginButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  },
  dividerText: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#F1F1F1',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  googleButton: {},
  googleText: {
    color: '#DB4437',
  },
  facebookButton: {},
  facebookText: {
    color: '#1877F2',
  },
  emailButton: {},
  emailText: {
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  footerLink: {
    color: '#4cd964',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
});