import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { initializeAuth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';

initializeApp(firebaseConfig);
WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();

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
    createUserWithEmailAndPassword(auth, email, password)
      .catch(e => Alert.alert('Sign up error', e.message));
  };

  const signIn = ()=>{
    signInWithEmailAndPassword(auth, email, password)
      .catch(e => Alert.alert('Sign in error', e.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in or Register</Text>

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
