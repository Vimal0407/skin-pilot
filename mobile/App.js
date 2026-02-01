import React, {useEffect, useState} from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import Onboarding from './screens/Onboarding';
import ChatScreen from './screens/ChatScreen';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

export default function App(){
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [needsOnboard, setNeedsOnboard] = useState(false);

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async (u)=>{
      setUser(u);
      if (u){
        // check profile
        try{
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          const data = snap.exists() ? snap.data() : null;
          const required = data && data.name && data.height && data.weight && data.skinType;
          setNeedsOnboard(!required);
        }catch(e){
          setNeedsOnboard(true);
        }
      } else setNeedsOnboard(false);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) return <ActivityIndicator style={{flex:1}} size="large" />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : needsOnboard ? (
          <Stack.Screen name="Onboarding">
            {props => <Onboarding {...props} user={user} onDone={() => { /* refetch handled by auth state change */ }} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Home">
            {props => <ChatScreen {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
