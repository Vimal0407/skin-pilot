import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AuthScreen from './screens/AuthScreen';
import Onboarding from './screens/Onboarding';
import ChatScreen from './screens/ChatScreen';
import shared from './styles';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

initializeApp(firebaseConfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        // check if user profile exists in Firestore; only show onboarding if missing
        const db = getFirestore();
        (async () => {
          try {
            const snap = await getDoc(doc(db, 'users', u.uid));
            setShowOnboarding(!snap.exists());
          } catch (e) {
            // fallback to showing onboarding on error
            setShowOnboarding(true);
          }
        })();
      }
    });
  }, []);

  const [screen, setScreen] = useState('chat');

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

      <TouchableOpacity style={{padding:12, marginTop:12}} onPress={() => getAuth().signOut()}>
        <Text style={{color:'#e53935'}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
