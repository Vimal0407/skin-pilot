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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const { width } = Dimensions.get('window');

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

export default function PhoneNumberSignup({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const fadeAnim = new Animated.Value(0);
  const buttonScale = new Animated.Value(1);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your phone number');
      return;
    }
    
    if (!password) {
      Alert.alert('Password Required', 'Please create a password');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Button animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSigningUp(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSigningUp(false);
      Alert.alert(
        'Account Created!',
        `Welcome to SkinPilot!\nYour account has been created with phone number ${selectedCountry.code} ${phoneNumber}`,
        [{ text: 'GET STARTED', onPress: () => console.log('Navigate to dashboard') }]
      );
    }, 2000);
  };

  const handleSocialSignup = (platform) => {
    if (platform === 'Email') {
      navigation.navigate('SignupEmail');
      return;
    }
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

  const handleCorporateLogin = () => {
    Alert.alert('Corporate Login', 'Redirecting to corporate login portal...');
  };

  const handleExistingUser = () => {
    Alert.alert('Existing User', 'Redirecting to login screen...');
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
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
                  <Ionicons name="checkmark" size={20} color="#2196F3" />
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
      colors={['#E3F2FD', '#F3E5F5', '#FCE4EC']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Top Links */}
            <View style={styles.topLinksContainer}>
              <TouchableOpacity onPress={handleCorporateLogin} style={styles.topLink}>
                <Text style={styles.topLinkText}>Corporate User?</Text>
              </TouchableOpacity>
              
              <View style={styles.separatorDot} />
              
              <TouchableOpacity onPress={handleExistingUser} style={styles.topLink}>
                <Text style={styles.topLinkText}>Already a user?</Text>
              </TouchableOpacity>
            </View>

            {/* Logo and Brand */}
            <View style={styles.brandContainer}>
              <LinearGradient
                colors={['#FF3B30', '#2196F3']}
                style={styles.logoContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoText}>SK</Text>
              </LinearGradient>
              
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandName}>Skin Pilot</Text>
                <Text style={styles.brandTagline}>Your Personal Skin Health Guide</Text>
              </View>
            </View>

            {/* Welcome Card */}
            <LinearGradient
              colors={['#FFFFFF', '#F5F7FA']}
              style={styles.welcomeCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.welcomeIconContainer}>
                <Ionicons name="sparkles" size={32} color="#2196F3" />
              </View>
              <Text style={styles.welcomeTitle}>Create your account</Text>
              <Text style={styles.welcomeSubtitle}>
                Join our community and get personalized skin analysis, treatment recommendations, and progress tracking.
              </Text>
            </LinearGradient>

            {/* Signup Form Card */}
            <View style={styles.signupCard}>
              <View style={styles.signupCardHeader}>
                <LinearGradient
                  colors={['#FF3B30', '#2196F3']}
                  style={styles.signupHeaderGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupTitle}>Start Your Skin Journey</Text>
                  <Text style={styles.signupSubtitle}>Enter your phone number to create an account</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.formContainer}>
                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelRow}>
                    <MaterialCommunityIcons name="phone" size={18} color="#2196F3" />
                    <Text style={styles.inputLabel}>Phone Number</Text>
                  </View>
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
                
                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelRow}>
                    <Feather name="lock" size={18} color="#2196F3" />
                    <Text style={styles.inputLabel}>Create a password</Text>
                  </View>
                  <View style={[styles.inputWrapper, password.length > 0 && validatePassword(password) && styles.inputValid]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Create a strong password"
                      placeholderTextColor="#AAA"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                    />
                    <View style={styles.passwordActions}>
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather 
                          name={showPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {password.length > 0 && !validatePassword(password) && (
                    <Text style={styles.validationError}>Password must be at least 6 characters</Text>
                  )}
                  {password.length > 0 && validatePassword(password) && (
                    <Text style={styles.validationSuccess}>Strong password!</Text>
                  )}
                </View>
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={[styles.passwordStrengthBar, { 
                      width: `${Math.min(password.length * 10, 100)}%`,
                      backgroundColor: password.length >= 8 ? '#4CD964' : 
                                     password.length >= 6 ? '#FF9500' : '#FF3B30'
                    }]} />
                  </View>
                )}
                
                {/* Terms & Conditions */}
                <TouchableOpacity 
                  style={styles.termsContainer}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContainer}>
                    <LinearGradient
                      colors={acceptTerms ? ['#FF3B30', '#2196F3'] : ['#E0E0E0', '#F5F5F5']}
                      style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {acceptTerms && <Feather name="check" size={16} color="white" />}
                    </LinearGradient>
                  </View>
                  <Text style={styles.termsText}>
                    By signing up, I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>, including usage of Cookies
                  </Text>
                </TouchableOpacity>
                
                {/* Sign Up Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity 
                    style={[styles.signupButton, (!phoneNumber || !password || !acceptTerms) && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    activeOpacity={0.8}
                    disabled={!phoneNumber || !password || !acceptTerms || isSigningUp}
                  >
                    <LinearGradient
                      colors={['#FF3B30', '#2196F3']}
                      style={styles.signupButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isSigningUp ? (
                        <View style={styles.buttonContent}>
                          <Ionicons name="refresh-outline" size={20} color="white" style={{ marginRight: 10 }} />
                          <Text style={styles.signupButtonText}>CREATING ACCOUNT...</Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 10 }} />
                          <Text style={styles.signupButtonText}>AGREE & SIGN UP</Text>
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
                    onPress={() => handleSocialSignup('Google')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.socialButtonContent}>
                      <FontAwesome name="google" size={20} color="#DB4437" />
                      <Text style={[styles.socialButtonText, styles.googleText]}>Google</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.facebookButton]}
                    onPress={() => handleSocialSignup('Facebook')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.socialButtonContent}>
                      <FontAwesome name="facebook-f" size={20} color="#4267B2" />
                      <Text style={[styles.socialButtonText, styles.facebookText]}>Facebook</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.emailButton]}
                    onPress={() => handleSocialSignup('Email')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.socialButtonContent}>
                      <MaterialIcons name="email" size={20} color="#333" />
                      <Text style={[styles.socialButtonText, styles.emailText]}>Email</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Benefits Section */}
                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>Why join Skin Pilot?</Text>
                  
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Ionicons name="analytics" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>Personalized Analysis</Text>
                      <Text style={styles.benefitDescription}>AI-powered skin analysis tailored to your skin type</Text>
                    </View>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Ionicons name="calendar" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>Treatment Tracking</Text>
                      <Text style={styles.benefitDescription}>Track your skincare routine and progress over time</Text>
                    </View>
                  </View>
                  
                  <View style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Ionicons name="people" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>Expert Community</Text>
                      <Text style={styles.benefitDescription}>Connect with dermatologists and skincare experts</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Bottom Security Note */}
            <View style={styles.bottomNote}>
              <Feather name="shield" size={14} color="#666" />
              <Text style={styles.bottomNoteText}>
                Your data is protected with bank-level security and never shared without permission
              </Text>
            </View>
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
  topLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  topLink: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  topLinkText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  separatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#AAA',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 15,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  brandTextContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: '#666',
  },
  welcomeCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.1)',
  },
  welcomeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  signupCard: {
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.1)',
  },
  signupCardHeader: {
    height: 100,
  },
  signupHeaderGradient: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  signupTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  signupSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    padding: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginLeft: 8,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    backgroundColor: '#FAFAFA',
  },
  inputValid: {
    borderColor: '#2196F3',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  passwordActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationError: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
    marginLeft: 5,
  },
  validationSuccess: {
    fontSize: 12,
    color: '#4CD964',
    marginTop: 5,
    marginLeft: 5,
  },
  passwordStrengthContainer: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  passwordStrengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 25,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxChecked: {
    shadowColor: '#FF3B30',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2196F3',
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonGradient: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupButtonText: {
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
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 5,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#F1F1F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#4267B2',
  },
  emailButton: {},
  emailText: {
    color: '#333',
  },
  benefitsContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  bottomNoteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
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