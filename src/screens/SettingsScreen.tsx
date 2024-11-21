import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Pressable, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = StatusBar.currentHeight

export default function SettingsScreen({ navigation }: any) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const loadApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('apiKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    };
    loadApiKey();
  }, []);

  const saveApiKey = async () => {
    await AsyncStorage.setItem('apiKey', apiKey);
    Alert.alert('API Key saved!','', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.container} >
      <Text style={styles.heading}>Settings Screen</Text>
        <TextInput
        	placeholder="Enter API Key"
        	style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
        />
      <Pressable style={styles.button} onPress={saveApiKey}><Text style={styles.buttonText}>Save API Key</Text></Pressable>
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