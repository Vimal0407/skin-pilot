import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function Onboarding({user, onDone}){
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [skinType, setSkinType] = useState('Normal');

  const save = async ()=>{
    try{
      const auth = getAuth();
      const db = getFirestore();
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, 'users', uid), {
        name, height, weight, skinType, updatedAt: new Date()
      }, {merge:true});
      onDone();
    }catch(e){
      Alert.alert('Save error', e.message);
    }
  };

  const skinOptions = ['Normal','Dry','Oily','Combination','Sensitive'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about yourself</Text>

      <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />

      <TextInput placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.input} />

      <TextInput placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Skin type</Text>
      <View style={styles.skinRow}>
        {skinOptions.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.skinOption, skinType === opt && styles.skinOptionActive]}
            onPress={() => setSkinType(opt)}
          >
            <Text style={[styles.skinText, skinType === opt && styles.skinTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 14
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },
  label: {
    marginTop: 6,
    marginBottom: 8,
    color: '#444'
  },
  skinRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skinOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  skinOptionActive: {
    backgroundColor: '#2b8aef',
    borderColor: '#2b8aef'
  },
  skinText: {
    color: '#333'
  },
  skinTextActive: {
    color: '#fff'
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2b8aef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
