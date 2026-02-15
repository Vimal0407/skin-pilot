import React, {useEffect, useState, Suspense, lazy} from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Lazy-load screens to reduce initial web bundle size
const AuthScreen = lazy(() => import('./screens/AuthScreen'));
const LoginNumberScreen = lazy(() => import('./screens/LoginNumberScreen'));
const SignupEmail = lazy(() => import('./screens/SignupEmail'));
const SignupNumber = lazy(() => import('./screens/SignupNumber'));
const Onboarding = lazy(() => import('./screens/Onboarding'));
const ChatScreen = lazy(() => import('./screens/ChatScreen'));
const BasicInformation = lazy(() => import('./screens/BasicInformation'));
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createUserDocIfMissing } from './firebaseHelpers';

const Stack = createNativeStackNavigator();

export default function App(){
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [needsOnboard, setNeedsOnboard] = useState(false);

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async (u)=>{
      setUser(u);
      if (u){
        // ensure a user document exists (create on first sign-in)
        try {
          await createUserDocIfMissing(u);
        } catch (err) {
          // non-fatal; continue to profile check
        }

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

  const initialRoute = !user ? 'Auth' : (needsOnboard ? 'Onboarding' : 'Home');

  return (
    <NavigationContainer>
      <Suspense fallback={<ActivityIndicator style={{flex:1}} size="large" />}>
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={initialRoute}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="LoginNumber" component={LoginNumberScreen} />
          <Stack.Screen name="SignupEmail" component={SignupEmail} />
          <Stack.Screen name="SignupNumber" component={SignupNumber} />
          <Stack.Screen name="Onboarding">
            {props => <Onboarding {...props} user={user} onDone={() => { /* refetch handled by auth state change */ }} />}
          </Stack.Screen>
          <Stack.Screen name="BasicInformation" component={BasicInformation} />
          <Stack.Screen name="Home">
            {props => <ChatScreen {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}
