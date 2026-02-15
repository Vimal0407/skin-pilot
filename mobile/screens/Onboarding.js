import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { auth } from '../firebase';
import { getUserProfile } from '../firebaseHelpers';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sample data for skincare products
const skincareProducts = [
  {
    id: '1',
    name: 'Vitamin C Serum',
    brand: 'La Roche-Posay',
    rating: 4.8,
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400',
    category: 'Anti-Aging',
  },
  {
    id: '2',
    name: 'Hyaluronic Acid',
    brand: 'The Ordinary',
    rating: 4.5,
    price: '$12.90',
    image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w-400',
    category: 'Hydration',
  },
  {
    id: '3',
    name: 'Retinol Cream',
    brand: 'CeraVe',
    rating: 4.6,
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400',
    category: 'Acne Treatment',
  },
  {
    id: '4',
    name: 'SPF 50 Sunscreen',
    brand: 'Neutrogena',
    rating: 4.7,
    price: '$18.99',
    image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400',
    category: 'Sun Protection',
  },
];

// Sample data for dermatologists
const dermatologists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Acne Specialist',
    rating: 4.9,
    experience: '12 years',
    clinic: 'Skin Health Clinic',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Anti-Aging',
    rating: 4.8,
    experience: '15 years',
    clinic: 'DermaCare Center',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Skin Cancer',
    rating: 4.9,
    experience: '10 years',
    clinic: 'Precision Dermatology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
];

export default function MainDashboard({ navigation }) {
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [weightLost, setWeightLost] = useState(0.0);
  const [userName, setUserName] = useState('');

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  };
  const [activeTab, setActiveTab] = useState('today');
  
  const progressAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(progressAnim, {
      toValue: weightLost / 6.0,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [weightLost]);

  useEffect(() => {
    let mounted = true;
    const loadName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const data = await getUserProfile(user.uid);
        if (!mounted) return;
        if (data && data.name) setUserName(String(data.name));
      } catch (err) {
        console.warn('Failed to load user name:', err);
      }
    };

    // Load on mount
    loadName();

    // Also reload when screen gains focus (e.g., after editing BasicInformation)
    const unsub = navigation?.addListener?.('focus', loadName);
    return () => { mounted = false; if (unsub) unsub(); };
  }, [navigation]);

  const handleAIAnalysis = () => {
    // Navigate to chat screen (AI analysis -> chat)
    // Use replace so Back does not return to Onboarding
    navigation && navigation.replace('Home');
  };

  const handleAddWater = () => {
    if (waterGlasses < 8) {
      setWaterGlasses(waterGlasses + 1);
    }
  };

  const handleResetWater = () => {
    setWaterGlasses(0);
  };

  const handleSleepTrack = () => {
    setSleepHours(7);
  };

  const handleAddWeightLoss = () => {
    if (weightLost < 6.0) {
      setWeightLost(weightLost + 0.5);
    }
  };

  const renderSkincareProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <LinearGradient
        colors={['rgba(255, 59, 48, 0.1)', 'rgba(33, 150, 243, 0.1)']}
        style={styles.productImage}
      >
        <Ionicons name="leaf" size={40} color="#2196F3" />
      </LinearGradient>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.productRating}>
          <FontAwesome name="star" size={12} color="#FF9500" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDermatologist = ({ item }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <LinearGradient
        colors={['rgba(33, 150, 243, 0.1)', 'rgba(255, 59, 48, 0.1)']}
        style={styles.doctorImage}
      >
        <Ionicons name="person-circle" size={50} color="#FF3B30" />
      </LinearGradient>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialization}>{item.specialization}</Text>
        <View style={styles.doctorDetails}>
          <View style={styles.detailItem}>
            <Feather name="star" size={12} color="#FF9500" />
            <Text style={styles.detailText}>{item.rating}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="briefcase" size={12} color="#666" />
            <Text style={styles.detailText}>{item.experience}</Text>
          </View>
        </View>
        <Text style={styles.doctorClinic}>{item.clinic}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Consultation</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Hi {userName || 'there'}!</Text>
                <Text style={styles.subGreeting}>Welcome to your skin health dashboard</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation && navigation.navigate('BasicInformation')}>
                <LinearGradient
                  colors={['#FF3B30', '#2196F3']}
                  style={styles.profileIcon}
                >
                  <Text style={styles.profileInitial}>{getInitials(userName || 'User')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Goal Card */}
            <LinearGradient
              colors={['#FF3B30', '#2196F3']}
              style={styles.goalCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.goalTitle}>To lose 6 kg in 6 weeks you need to</Text>
              
              <View style={styles.goalMetrics}>
                <View style={styles.metricItem}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="nutrition" size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.metricLabel}>Nutrition</Text>
                    <Text style={styles.metricValue}>Eat upto 1,300 Cal</Text>
                  </View>
                </View>
                
                <View style={styles.metricItem}>
                  <View style={styles.metricIcon}>
                    <Ionicons name="fitness" size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.metricLabel}>Workout</Text>
                    <Text style={styles.metricValue}>Burn at least 264 Cal</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Stats Overview */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="water" size={24} color="#2196F3" />
                  <Text style={styles.statTitle}>Hydration</Text>
                </View>
                <Text style={styles.statValue}>{waterGlasses}/8 glasses</Text>
                <View style={styles.waterBottles}>
                  {[...Array(8)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.waterBottle,
                        index < waterGlasses && styles.waterBottleFilled,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.statActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleAddWater}
                    disabled={waterGlasses >= 8}
                  >
                    <Text style={styles.actionButtonText}>+ Add Glass</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.resetButton]}
                    onPress={handleResetWater}
                  >
                    <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="moon" size={24} color="#2196F3" />
                  <Text style={styles.statTitle}>Sleep</Text>
                </View>
                <Text style={styles.statValue}>{sleepHours}/7 hours</Text>
                <View style={styles.sleepTrack}>
                  <View style={styles.sleepHours}>
                    {[...Array(7)].map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.sleepHour,
                          index < sleepHours && styles.sleepHourCompleted,
                        ]}
                      >
                        <Text style={styles.sleepHourText}>{index + 1}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.sleepButton}
                  onPress={handleSleepTrack}
                >
                  <Text style={styles.sleepButtonText}>Track Sleep</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Weight Loss Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Weight Loss Progress</Text>
                <Text style={styles.progressValue}>{weightLost.toFixed(1)} of 6.0 kg lost</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
              </View>
              <View style={styles.progressActions}>
                <Text style={styles.progressSubtitle}>Target: 6.0 kg in 6 weeks</Text>
                <TouchableOpacity
                  style={styles.updateProgressButton}
                  onPress={handleAddWeightLoss}
                  disabled={weightLost >= 6.0}
                >
                  <Text style={styles.updateProgressText}>Update Progress</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI Analysis Section */}
            <TouchableOpacity style={styles.aiCard} onPress={handleAIAnalysis}>
              <LinearGradient
                colors={['rgba(255, 59, 48, 0.9)', 'rgba(33, 150, 243, 0.9)']}
                style={styles.aiCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.aiContent}>
                  <View style={styles.aiIconContainer}>
                    <Ionicons name="sparkles" size={32} color="white" />
                  </View>
                  <View style={styles.aiTextContainer}>
                    <Text style={styles.aiTitle}>AI Skin Analysis</Text>
                    <Text style={styles.aiSubtitle}>Get personalized skin insights and recommendations</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Nutrition & Workout Sections */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'today' && styles.activeTab]}
                onPress={() => setActiveTab('today')}
              >
                <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'week' && styles.activeTab]}
                onPress={() => setActiveTab('week')}
              >
                <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
                  This Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'month' && styles.activeTab]}
                onPress={() => setActiveTab('month')}
              >
                <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>
                  This Month
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nutritionCard}>
              <View style={styles.nutritionHeader}>
                <View style={styles.nutritionIcon}>
                  <Ionicons name="restaurant" size={24} color="#2196F3" />
                </View>
                <View>
                  <Text style={styles.nutritionTitle}>Nutrition</Text>
                  <Text style={styles.nutritionSubtitle}>792,091 foods tracked in last 24 hrs</Text>
                </View>
              </View>
              <View style={styles.calorieInfo}>
                <Text style={styles.calorieLabel}>Today's Target:</Text>
                <Text style={styles.calorieValue}>1,300 Cal</Text>
              </View>
              <TouchableOpacity style={styles.logMealButton}>
                <Text style={styles.logMealText}>Log Your Meal</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutIcon}>
                  <Ionicons name="fitness" size={24} color="#FF3B30" />
                </View>
                <View>
                  <Text style={styles.workoutTitle}>Workout</Text>
                  <Text style={styles.workoutSubtitle}>Burn at least 264 Cal</Text>
                </View>
              </View>
              <View style={styles.caloriesInfo}>
                <Text style={styles.caloriesLabel}>Calories to burn:</Text>
                <Text style={styles.caloriesValue}>264 Cal</Text>
              </View>
              <TouchableOpacity style={styles.startWorkoutButton}>
                <Text style={styles.startWorkoutText}>Start Workout</Text>
              </TouchableOpacity>
            </View>

            {/* Skincare Recommendations */}
            <View style={styles.recommendationsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended Skincare</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={skincareProducts}
                renderItem={renderSkincareProduct}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            </View>

            {/* Dermatologist Recommendations */}
            <View style={styles.doctorsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Dermatologists</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={dermatologists}
                renderItem={renderDermatologist}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.doctorsList}
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="camera" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.actionLabel}>Skin Scan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="calendar" size={24} color="#FF3B30" />
                  </View>
                  <Text style={styles.actionLabel}>Appointments</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="document-text" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.actionLabel}>Reports</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionItem}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="settings" size={24} color="#FF3B30" />
                  </View>
                  <Text style={styles.actionLabel}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  goalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  goalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  waterBottles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  waterBottle: {
    width: 30,
    height: 40,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  waterBottleFilled: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sleepTrack: {
    marginBottom: 12,
  },
  sleepHours: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sleepHour: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepHourCompleted: {
    backgroundColor: '#2196F3',
  },
  sleepHourText: {
    fontSize: 12,
    color: '#666',
  },
  sleepHourCompleted: {
    backgroundColor: '#2196F3',
  },
  sleepHourCompleted: {
    backgroundColor: '#2196F3',
  },
  sleepHourText: {
    fontSize: 12,
    color: '#666',
  },
  sleepHourCompletedText: {
    color: 'white',
  },
  statActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#F0F0F0',
  },
  resetButtonText: {
    color: '#666',
  },
  sleepButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
  },
  sleepButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  progressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  updateProgressButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateProgressText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  aiCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  aiCardGradient: {
    padding: 20,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  calorieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
  },
  calorieValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  logMealButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 12,
  },
  logMealText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  caloriesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
  },
  caloriesValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
  },
  startWorkoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
  },
  startWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  productsList: {
    paddingRight: 16,
  },
  productCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 10,
    color: '#FF3B30',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  doctorsSection: {
    marginBottom: 24,
  },
  doctorsList: {
    paddingRight: 16,
  },
  doctorCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  doctorDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  doctorClinic: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});