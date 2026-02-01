import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // use initialized auth from firebase.js
  // const auth is imported from ../firebase

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '<YOUR_IOS_OR_ANDROID_GOOGLE_CLIENT_ID>'
  });

  React.useEffect(() => {
    if (response?.type === 'success'){
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(e=>Alert.alert('Google sign-in error', e.message));
    }
  }, [response]);

  const signUp = ()=>{
    if (!email || !password){
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCred => {
        Alert.alert('Success', 'Account created.');
      })
      .catch(e => Alert.alert('Sign up error', e.message));
  };

  const signIn = ()=>{
    if (!email || !password){
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Signed in');
      })
      .catch(e => Alert.alert('Sign in error', e.message));
  };

  const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

  const sendOtp = async ()=>{
    if (!phone) { Alert.alert('Validation', 'Please enter phone number (include country code)'); return; }
    try{
      setSending(true);
      const res = await fetch(`${BACKEND_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const j = await res.json();
      setSending(false);
      if (j.success){
        Alert.alert('OTP Sent', 'Check your SMS (or demo response).');
      } else {
        Alert.alert('Error', j.error || 'Failed to send OTP');
      }
    } catch(e){
      setSending(false);
      Alert.alert('Network error', e.message);
    }
  };

  const verifyOtp = async ()=>{
    if (!phone || !otp){ Alert.alert('Validation', 'Enter phone and OTP'); return; }
    try{
      setVerifying(true);
      const res = await fetch(`${BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      });
      const j = await res.json();
      setVerifying(false);
      if (j.success){
        // lightweight approach: sign in anonymously so app auth state flows to onboarding/home
        signInAnonymously(auth)
          .then(()=>{
            Alert.alert('Verified', 'OTP verified — continuing.');
          })
          .catch(e=>Alert.alert('Auth error', e.message));
      } else {
        Alert.alert('Verification failed', j.error || 'Invalid code');
      }
    } catch(e){
      setVerifying(false);
      Alert.alert('Network error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in or Register</Text>

      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 12}}>
        <TouchableOpacity onPress={()=>setMethod('email')} style={[styles.methodButton, method==='email' && styles.methodActive]}>
          <Text style={[styles.methodText, method==='email' && styles.methodTextActive]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMethod('phone')} style={[styles.methodButton, method==='phone' && styles.methodActive]}>
          <Text style={[styles.methodText, method==='phone' && styles.methodTextActive]}>Phone / OTP</Text>
        </TouchableOpacity>
      </View>

      {method === 'email' ? (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Phone (+123... )"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={sendOtp} disabled={sending}>
            {sending ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryButtonText}>Send OTP</Text>}
          </TouchableOpacity>

          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp} disabled={verifying}>
            {verifying ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryButtonText}>Verify OTP</Text>}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()} disabled={!request}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Phone/OTP: native Firebase or a Twilio backend is recommended. Ask and I'll add it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  primaryButton: {
    backgroundColor: '#2b8aef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2b8aef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  secondaryButtonText: {
    color: '#2b8aef',
    fontWeight: '600'
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  googleButtonText: {
    color: '#444'
  },
  hint: {
    color: '#666',
    marginTop: 14,
    textAlign: 'center',
    fontSize: 12
  }
});
