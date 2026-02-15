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
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons, 
  FontAwesome, 
  MaterialCommunityIcons, 
  Feather,
  MaterialIcons 
} from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const { width, height } = Dimensions.get('window');

export default function SkinPilotLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const animatedValue = new Animated.Value(0);
  const buttonScale = new Animated.Value(1);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms & Conditions');
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
    
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      Alert.alert('Success', `Welcome back to SkinPilot!\nYou've successfully logged in.`);
    }, 2000);
  };

  const handleSocialLogin = (platform) => {
    if (platform === 'Phone') {
      navigation.navigate('LoginNumber');
      return;
    }
    if (platform === 'Google') {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(() => {
          Alert.alert('Success', 'Signed in with Google');
          navigation && navigation.navigate('Onboarding');
        })
        .catch(e => Alert.alert('Google sign-in error', e.message));
      return;
    }
    Alert.alert(`Login with ${platform}`, `You'll be redirected to ${platform} for authentication`);
  };

  const handleForgotPassword = () => {
    Alert.alert('Reset Password', 'A password reset link has been sent to your email.');
  };

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
          {/* Animated Floating Elements */}
          <Animated.View 
            style={[styles.floatingCircle1, { transform: [{ translateY }] }]}
          />
          <Animated.View 
            style={[styles.floatingCircle2, { 
              transform: [{ translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              })}] 
            }]}
          />
          
          {/* Logo and Header Section */}
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['#FF3B30', '#2196F3']}
              style={styles.logoContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoInner}>
                <Text style={styles.logoText}>SP</Text>
              </View>
            </LinearGradient>
            
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>Skin<Text style={styles.brandNameHighlight}>Pilot</Text></Text>
              <Text style={styles.brandTagline}>Your Skin Health Companion</Text>
            </View>
          </View>
          
          {/* Welcome Card */}
          <LinearGradient
            colors={['#FFFFFF', '#F8FFFB']}
            style={styles.welcomeCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="sparkles" size={32} color="#2196F3" />
            </View>
            <Text style={styles.welcomeTitle}>Create Your Account</Text>
            <Text style={styles.welcomeSubtitle}>
              Join millions achieving their skin care goals with personalized analysis and expert recommendations from SkinPilot.
            </Text>
          </LinearGradient>
          
          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.loginCardHeader}>
              <LinearGradient
                colors={['#FF3B30', '#2196F3']}
                style={styles.loginHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginTitle}>Login to Your Account</Text>
                <Text style={styles.loginSubtitle}>Welcome back! Please enter your details</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelRow}>
                  <Feather name="mail" size={16} color="#2196F3" />
                  <Text style={styles.inputLabel}>Email Address</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#AAA"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {email.length > 0 && (
                    <Feather name="check-circle" size={20} color="#2196F3" />
                  )}
                </View>
              </View>
              
              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelRow}>
                  <Feather name="lock" size={16} color="#2196F3" />
                  <Text style={styles.inputLabel}>Password</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#AAA"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              
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
                  By signing in, I accept the <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>
              
              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={isLoggingIn}
                >
                  <LinearGradient
                    colors={['#FF3B30', '#2196F3']}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoggingIn ? (
                      <View style={styles.loginButtonContent}>
                        <Ionicons name="refresh-outline" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.loginButtonText}>Logging in...</Text>
                      </View>
                    ) : (
                      <View style={styles.loginButtonContent}>
                        <Ionicons name="lock-open-outline" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>
              
              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.7}
                >
                  <View style={styles.socialButtonContent}>
                    <FontAwesome name="google" size={20} color="#DB4437" />
                    <Text style={[styles.socialButtonText, styles.googleText]}>Google</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('Facebook')}
                  activeOpacity={0.7}
                >
                  <View style={styles.socialButtonContent}>
                    <FontAwesome name="facebook" size={20} color="#4267B2" />
                    <Text style={[styles.socialButtonText, styles.facebookText]}>Facebook</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, styles.phoneButton]}
                  onPress={() => handleSocialLogin('Phone')}
                  activeOpacity={0.7}
                >
                  <View style={styles.socialButtonContent}>
                    <MaterialCommunityIcons name="phone" size={20} color="#333" />
                    <Text style={[styles.socialButtonText, styles.phoneText]}>Phone</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don't have an account? 
                  <Text style={styles.footerLink} onPress={() => navigation.navigate('SignupEmail')}> Create one now</Text>
                </Text>
                <View style={styles.appBadges}>
                  <View style={styles.badge}>
                    <Feather name="award" size={14} color="#2196F3" />
                    <Text style={styles.badgeText}>Certified</Text>
                  </View>
                  <View style={styles.badge}>
                    <Feather name="shield" size={14} color="#2196F3" />
                    <Text style={styles.badgeText}>Secure</Text>
                  </View>
                  <View style={styles.badge}>
                    <Feather name="users" size={14} color="#2196F3" />
                    <Text style={styles.badgeText}>5M+ Users</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              <Feather name="info" size={12} color="#666" /> 
              {' '}Your skin data is protected with 256-bit encryption
            </Text>
          </View>
        </ScrollView>
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
  floatingCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    top: -50,
    left: -50,
  },
  floatingCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    top: 100,
    right: -50,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  brandContainer: {
    marginLeft: 15,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  brandNameHighlight: {
    color: '#2196F3',
  },
  brandTagline: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loginCard: {
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
  loginCardHeader: {
    height: 100,
  },
  loginHeaderGradient: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  loginSubtitle: {
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
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginLeft: 8,
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
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
    marginRight: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  checkboxContainer: {
    marginRight: 12,
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
  },
  termsLink: {
    color: '#2196F3',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonGradient: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonContent: {
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
    marginBottom: 25,
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
  phoneButton: {},
  phoneText: {
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 15,
  },
  footerLink: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  appBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 5,
  },
  bottomInfo: {
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  bottomInfoText: {
    fontSize: 12,
    color: '#666',
  },
});