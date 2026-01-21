import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import shared from '../styles';

export default function ChatScreen({onBack}){
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_BASE = global.BACKEND_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

  const send = async ()=>{
    if (!text.trim()) return;
    const userMsg = {id: Date.now().toString(), from: 'user', text: text.trim()};
    setMessages(prev => [...prev, userMsg]);
    setText('');
    setLoading(true);
    try{
      const res = await fetch(`${BACKEND_BASE}/chat`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: userMsg.text})
      });
      const json = await res.json();
      const replyText = json?.reply ?? json?.detail ?? 'No reply from server';
      const reply = {id: (Date.now()+1).toString(), from: 'bot', text: replyText};
      setMessages(prev => [...prev, reply]);
    }catch(e){
      const errMsg = {id: (Date.now()+2).toString(), from: 'bot', text: 'Error: '+ e.message};
      setMessages(prev => [...prev, errMsg]);
    }finally{ setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={shared.page}>
        <TouchableOpacity onPress={onBack} style={{marginBottom:12}}>
          <Text style={{color:'#2b8aef'}}>← Back</Text>
        </TouchableOpacity>

        <FlatList
          data={messages}
          keyExtractor={i=>i.id}
          renderItem={({item})=> (
            <View style={{marginVertical:6, alignSelf: item.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%'}}>
              <View style={{backgroundColor: item.from === 'user' ? '#2b8aef' : '#f1f1f1', padding:10, borderRadius:8}}>
                <Text style={{color: item.from === 'user' ? '#fff' : '#111'}}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <View style={{flexDirection:'row', gap:8, alignItems:'center'}}>
          <TextInput value={text} onChangeText={setText} placeholder='Ask about skin...' style={[shared.input, {flex:1}]} />
          <TouchableOpacity style={[shared.primaryButton, {marginLeft:8, paddingHorizontal:16}]} onPress={send} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={shared.primaryButtonText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
