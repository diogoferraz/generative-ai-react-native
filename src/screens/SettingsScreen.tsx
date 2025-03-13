import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Pressable, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = StatusBar.currentHeight

export default function SettingsScreen({ navigation }: any) {
  const [apiKey, setApiKey] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');

  useEffect(() => {
    const loadApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('apiKey');
      const storedGoogleApiKey = await AsyncStorage.getItem('googleApiKey');

      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
      if (storedGoogleApiKey) {
        setGoogleApiKey(storedGoogleApiKey);
      }
    };
    loadApiKey();
  }, []);

  const saveApiKey = async () => {
    await AsyncStorage.setItem('apiKey', apiKey);
    Alert.alert('API Key saved!','', [
      {
        text: 'OK',
      },
    ]);
  };

  const saveGoogleApiKey = async () => {
    await AsyncStorage.setItem('googleApiKey', googleApiKey);
    Alert.alert('Google API Key saved!','', [
      {
        text: 'OK',
      },
    ]);
  };

  return (
    <View style={styles.container} >
      <Text style={styles.heading}>Settings Screen</Text>
      <View>
        <TextInput
          placeholder="Enter API Key"
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
        />
        <Pressable style={styles.button} onPress={saveApiKey}><Text style={styles.buttonText}>Save API Key</Text></Pressable>
      </View>
      <View>
        <TextInput
          placeholder="Enter AI Vision API Key"
          style={styles.input}
          value={googleApiKey}
          onChangeText={setGoogleApiKey}
        />
        <Pressable style={styles.button} onPress={saveGoogleApiKey}><Text style={styles.buttonText}>Save API Key</Text></Pressable>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Back to Home</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
	button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
	heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
		marginBottom: 20
  },
	container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
		paddingHorizontal: 20
  },
});