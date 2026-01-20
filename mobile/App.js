import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AuthScreen from './screens/AuthScreen';
import Onboarding from './screens/Onboarding';
import ChatScreen from './screens/ChatScreen';
import shared from './styles';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

initializeApp(firebaseConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        setShowOnboarding(true);
      }
    });
  }, []);

  const [screen, setScreen] = useState('home');

  if (!user) return <AuthScreen />;
  if (showOnboarding) return <Onboarding user={user} onDone={() => setShowOnboarding(false)} />;

  if (screen === 'chat') return <ChatScreen onBack={() => setScreen('home')} />;

  return (
    <View style={shared.page}>
      <Text style={shared.title}>Welcome, {user.email || user.phoneNumber}</Text>

      <TouchableOpacity style={[shared.primaryButton, {marginBottom:12}]} onPress={() => setScreen('chat')}>
        <Text style={shared.primaryButtonText}>Chat with AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{padding:12}} onPress={() => alert('Water tracker not implemented yet')}>
        <Text style={{color:'#2b8aef'}}>Track Water</Text>
      </TouchableOpacity>
    </View>
  );
}
