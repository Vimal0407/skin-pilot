import React, { useState, useEffect } from 'react';
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
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { updateUserProfile, getUserProfile } from '../firebaseHelpers';

const { width, height } = Dimensions.get('window');

export default function BasicInformationScreen({ navigation }) {
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    age: '',
    dailyActivity: '',
  });

  // Physical Information State
  const [physicalInfo, setPhysicalInfo] = useState({
    height: '',
    currentWeight: '',
    targetWeight: '',
    goalPace: '',
    bmi: '',
  });

  // Medical Conditions
  const [medicalConditions, setMedicalConditions] = useState([
    { id: 1, name: 'Diabetes', selected: false },
    { id: 2, name: 'Hypertension', selected: false },
    { id: 3, name: 'Asthma', selected: false },
    { id: 4, name: 'Arthritis', selected: false },
    { id: 5, name: 'Thyroid', selected: false },
    { id: 6, name: 'Heart Disease', selected: false },
  ]);

  // Emotional Health Conditions
  const [emotionalHealth, setEmotionalHealth] = useState([
    { id: 1, name: 'Stress', selected: false },
    { id: 2, name: 'Anxiety', selected: false },
    { id: 3, name: 'Depression', selected: false },
    { id: 4, name: 'Sleep Issues', selected: false },
    { id: 5, name: 'Low Motivation', selected: false },
    { id: 6, name: 'Emotional Eating', selected: false },
    { id: 7, name: 'Loneliness', selected: false },
    { id: 8, name: 'Mood Swings', selected: false },
  ]);

  const [city, setCity] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedMedicalCount, setSelectedMedicalCount] = useState(0);
  const [selectedEmotionalCount, setSelectedEmotionalCount] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savedVisible, setSavedVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const user = auth.currentUser;
        if (!user) {
          if (mounted) setProfileLoading(false);
          return;
        }
        const data = await getUserProfile(user.uid);
        if (!mounted) return;
        if (!data) {
          setProfileLoading(false);
          return;
        }

        // Map personal info
        setPersonalInfo(prev => ({
          ...prev,
          name: data.name ?? prev.name,
          gender: data.gender ?? prev.gender,
          phone: data.phone ?? prev.phone,
          email: data.email ?? prev.email,
          age: data.age != null ? String(data.age) : prev.age,
          dailyActivity: data.dailyActivity ?? prev.dailyActivity,
        }));

        // Map physical info
        setPhysicalInfo(prev => ({
          ...prev,
          height: data.height != null ? String(data.height) : prev.height,
          currentWeight: data.currentWeight != null ? String(data.currentWeight) : prev.currentWeight,
          targetWeight: data.targetWeight != null ? String(data.targetWeight) : prev.targetWeight,
          goalPace: data.goalPace ?? prev.goalPace,
          bmi: data.bmi ?? prev.bmi,
        }));

        // Map medical conditions (array of names)
        if (Array.isArray(data.medicalConditions)) {
          const setNames = new Set(data.medicalConditions.map(String));
          const updated = medicalConditions.map(c => ({ ...c, selected: setNames.has(c.name) }));
          setMedicalConditions(updated);
          setSelectedMedicalCount(updated.filter(c => c.selected).length);
        }

        // Map emotional health
        if (Array.isArray(data.emotionalHealth)) {
          const setNames = new Set(data.emotionalHealth.map(String));
          const updated = emotionalHealth.map(c => ({ ...c, selected: setNames.has(c.name) }));
          setEmotionalHealth(updated);
          setSelectedEmotionalCount(updated.filter(c => c.selected).length);
        }

        // City
        if (data.city) setCity(data.city);
        setProfileLoading(false);
      } catch (err) {
        console.warn('Error loading profile:', err);
        if (mounted) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, []);

  // Activity Levels
  const activityLevels = [
    'Little or No Activity',
    'Light Activity (1-3 days/week)',
    'Moderate Activity (3-5 days/week)',
    'Active (6-7 days/week)',
    'Very Active (athlete level)'
  ];

  // Update personal info
  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update physical info
  const updatePhysicalInfo = (field, value) => {
    setPhysicalInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate BMI if height or weight changes
    if (field === 'height' || field === 'currentWeight') {
      calculateBMI(field, value);
    }
  };

  // Calculate BMI
  const calculateBMI = (field, value) => {
    const height = field === 'height' ? parseFloat(value) / 100 : parseFloat(physicalInfo.height) / 100;
    const weight = field === 'currentWeight' ? parseFloat(value) : parseFloat(physicalInfo.currentWeight);
    
    if (height > 0 && weight > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setPhysicalInfo(prev => ({
        ...prev,
        bmi: bmi
      }));
    }
  };

  // Toggle medical condition
  const toggleMedicalCondition = (id) => {
    const updated = medicalConditions.map(condition =>
      condition.id === id ? { ...condition, selected: !condition.selected } : condition
    );
    setMedicalConditions(updated);
    setSelectedMedicalCount(updated.filter(c => c.selected).length);
  };

  // Toggle emotional health condition
  const toggleEmotionalHealth = (id) => {
    const updated = emotionalHealth.map(condition =>
      condition.id === id ? { ...condition, selected: !condition.selected } : condition
    );
    setEmotionalHealth(updated);
    setSelectedEmotionalCount(updated.filter(c => c.selected).length);
  };

  // Handle save
  const handleSave = async () => {
    const selectedMedical = medicalConditions.filter(c => c.selected).map(c => c.name);
    const selectedEmotional = emotionalHealth.filter(c => c.selected).map(c => c.name);

    const patch = {
      name: personalInfo.name || null,
      gender: personalInfo.gender || null,
      phone: personalInfo.phone || null,
      email: personalInfo.email || null,
      age: personalInfo.age ? Number(personalInfo.age) : null,
      dailyActivity: personalInfo.dailyActivity || null,
      height: physicalInfo.height ? Number(physicalInfo.height) : null,
      currentWeight: physicalInfo.currentWeight ? Number(physicalInfo.currentWeight) : null,
      targetWeight: physicalInfo.targetWeight ? Number(physicalInfo.targetWeight) : null,
      goalPace: physicalInfo.goalPace || null,
      bmi: physicalInfo.bmi || null,
      medicalConditions: selectedMedical,
      emotionalHealth: selectedEmotional,
      city: city || null
    };

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No signed-in user');
      await updateUserProfile(user.uid, patch);
      // show transient saved popup for 3 seconds
      setSavedVisible(true);
      setTimeout(() => setSavedVisible(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Save failed', err.message || 'Unable to save profile.');
    }
    
    // Log saved data for debugging
    console.log('Saved patch:', patch);
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // attempt firebase sign-out then redirect to Auth screen
    setShowLogoutModal(false);
    signOut(auth)
      .then(() => {
        navigation.replace('Auth');
      })
      .catch((err) => {
        console.error('Sign out error:', err);
        Alert.alert('Logout failed', err.message || 'Unable to logout. Please try again.');
      });
  };

  // Get BMI category
  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <LinearGradient
      colors={['#F8F9FF', '#F0F7FF', '#E8F4FF']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#1d3557" />
        {savedVisible && (
          <View style={styles.savedToast}>
            <Text style={styles.savedToastText}>Changes saved</Text>
          </View>
        )}
        
        {/* Header */}
        <LinearGradient
          colors={['#1d3557', '#2c4d7c']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Basic Information</Text>
            <Text style={styles.headerSubtitle}>Edit your personal and health details</Text>
          </View>
        </LinearGradient>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.cardHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.cardTitleContainer}>
                  <MaterialIcons name="person-outline" size={20} color="white" />
                  <Text style={styles.cardTitle}>Personal Details</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.name}
                    onChangeText={(text) => updatePersonalInfo('name', text)}
                    placeholder="Enter your name"
                  />
                  <Feather name="edit-2" size={18} color="#2196F3" />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What do we call you?</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      personalInfo.gender === 'Male' && styles.genderButtonSelected
                    ]}
                    onPress={() => updatePersonalInfo('gender', 'Male')}
                  >
                    <Text style={[
                      styles.genderText,
                      personalInfo.gender === 'Male' && styles.genderTextSelected
                    ]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      personalInfo.gender === 'Female' && styles.genderButtonSelected
                    ]}
                    onPress={() => updatePersonalInfo('gender', 'Female')}
                  >
                    <Text style={[
                      styles.genderText,
                      personalInfo.gender === 'Female' && styles.genderTextSelected
                    ]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.phone}
                    onChangeText={(text) => updatePersonalInfo('phone', text)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                  <Feather name="phone" size={18} color="#2196F3" />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.email}
                    onChangeText={(text) => updatePersonalInfo('email', text)}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Feather name="mail" size={18} color="#2196F3" />
                </View>
              </View>

              {/* Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age (in years)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.age}
                    onChangeText={(text) => updatePersonalInfo('age', text)}
                    placeholder="Enter age"
                    keyboardType="numeric"
                  />
                  <Feather name="calendar" size={18} color="#2196F3" />
                </View>
              </View>

              {/* Daily Activity */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Daily Activity</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.dailyActivity}
                    onChangeText={(text) => updatePersonalInfo('dailyActivity', text)}
                    placeholder="Select activity level"
                  />
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2196F3" />
                </View>
              </View>
            </View>
          </View>

          {/* Physical Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={['#FF3B30', '#D32F2F']}
                style={styles.cardHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.cardTitleContainer}>
                  <MaterialIcons name="fitness-center" size={20} color="white" />
                  <Text style={styles.cardTitle}>Physical Details</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              {/* Height */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={physicalInfo.height}
                    onChangeText={(text) => updatePhysicalInfo('height', text)}
                    placeholder="Enter height in cm"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>cm</Text>
                </View>
              </View>

              {/* Current Weight */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Weight</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={physicalInfo.currentWeight}
                    onChangeText={(text) => updatePhysicalInfo('currentWeight', text)}
                    placeholder="Enter current weight"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>

              {/* Target Weight */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Weight</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={physicalInfo.targetWeight}
                    onChangeText={(text) => updatePhysicalInfo('targetWeight', text)}
                    placeholder="Enter target weight"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>

              {/* Goal Pace */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Goal Pace</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={physicalInfo.goalPace}
                    onChangeText={(text) => updatePhysicalInfo('goalPace', text)}
                    placeholder="Enter goal pace"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>kg per week</Text>
                </View>
              </View>

              {/* BMI Display */}
              <View style={styles.bmiContainer}>
                <LinearGradient
                  colors={['#1d3557', '#2c4d7c']}
                  style={styles.bmiGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.bmiLabel}>BMI</Text>
                  <View style={styles.bmiValueContainer}>
                    <Text style={styles.bmiValue}>{physicalInfo.bmi}</Text>
                    <View style={styles.bmiCategoryContainer}>
                      <Text style={styles.bmiCategory}>{getBMICategory(physicalInfo.bmi)}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Additional Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.cardHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.cardTitleContainer}>
                  <MaterialIcons name="medical-services" size={20} color="white" />
                  <Text style={styles.cardTitle}>Health Information</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              {/* Medical Conditions */}
              <View style={styles.inputGroup}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.label}>Medical Conditions</Text>
                  <Text style={styles.selectedCount}>
                    Selected {selectedMedicalCount} conditions
                  </Text>
                </View>
                
                <View style={styles.conditionsGrid}>
                  {medicalConditions.map((condition) => (
                    <TouchableOpacity
                      key={condition.id}
                      style={[
                        styles.conditionChip,
                        condition.selected && styles.conditionChipSelected
                      ]}
                      onPress={() => toggleMedicalCondition(condition.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        condition.selected && styles.checkboxSelected
                      ]}>
                        {condition.selected && (
                          <Feather name="check" size={12} color="white" />
                        )}
                      </View>
                      <Text style={[
                        styles.conditionText,
                        condition.selected && styles.conditionTextSelected
                      ]}>
                        {condition.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Emotional Health */}
              <View style={styles.inputGroup}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.label}>Emotional Health</Text>
                  <Text style={styles.selectedCount}>
                    Selected {selectedEmotionalCount} conditions
                  </Text>
                </View>
                
                <View style={styles.conditionsGrid}>
                  {emotionalHealth.map((condition) => (
                    <TouchableOpacity
                      key={condition.id}
                      style={[
                        styles.conditionChip,
                        condition.selected && styles.conditionChipSelected
                      ]}
                      onPress={() => toggleEmotionalHealth(condition.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        condition.selected && styles.checkboxSelected
                      ]}>
                        {condition.selected && (
                          <Feather name="check" size={12} color="white" />
                        )}
                      </View>
                      <Text style={[
                        styles.conditionText,
                        condition.selected && styles.conditionTextSelected
                      ]}>
                        {condition.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter your city"
                  />
                  <Feather name="map-pin" size={18} color="#2196F3" />
                </View>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF3B30', '#D32F2F']}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="save" size={20} color="white" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1d3557', '#2c4d7c']}
              style={styles.logoutButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="log-out" size={20} color="white" style={styles.logoutIcon} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons name="logout" size={40} color="#FF3B30" />
                <Text style={styles.modalTitle}>Confirm Logout</Text>
              </View>
              
              <Text style={styles.modalMessage}>
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmLogout}
                >
                  <LinearGradient
                    colors={['#FF3B30', '#D32F2F']}
                    style={styles.confirmButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.confirmButtonText}>Logout</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#FF3B30',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    height: 60,
  },
  cardHeaderGradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1d3557',
    marginBottom: 8,
  },
  inputContainer: {
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
    fontSize: 16,
    color: '#333',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  genderTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  bmiContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bmiGradient: {
    padding: 20,
    borderRadius: 12,
  },
  bmiLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  bmiValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  bmiCategoryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '500',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '48%',
  },
  conditionChipSelected: {
    backgroundColor: '#FF3B30',
    borderColor: '#D32F2F',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1d3557',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  conditionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  conditionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonGradient: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    marginRight: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  logoutButtonGradient: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1d3557',
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  savedToast: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 8 : 12,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 50,
    elevation: 6,
  },
  savedToastText: {
    color: '#fff',
    fontWeight: '600',
  },
});