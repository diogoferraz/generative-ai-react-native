import { useEffect, useState } from 'react'
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard, Image,
  Button
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import {prompt as winePrompt} from '../prompts/prompt'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const statusBarHeight = StatusBar.currentHeight

export default function HomeScreen({ navigation }: any) {

  const [wineName, setWineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [wineInfo, setWineInfo] = useState("")
  const [apiKey, setApiKey] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const loadApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('apiKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    };
    loadApiKey();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  async function handleGenerate() {
    // if (wineName === "" || image === "") {
    //   Alert.alert("Atenção", "Forneça o nome ou imagem da Vinho!")
    //   return;
    // }

    setWineInfo("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `${winePrompt}\nNome do vinho: ${wineName ? wineName : "Nenhuma nome fornecida"}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-2024-07-18",
          messages: [
            { role: "system", content: "Você é um assistente especializado em vinhos." },
            { role: "user", content: prompt || "detalhes sobre o vinho" }
          ],
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setWineInfo(data.choices[0].message.content);
      } else {
        if (data.error && data.error.code === "insufficient_quota") {
          Alert.alert("Erro", "Você excedeu sua cota atual. Verifique seu plano e detalhes de cobrança.");
        } else {
          Alert.alert("Erro", data.error.message || "Ocorreu um erro ao gerar a informação do vinho.");
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro ao gerar a informação do vinho.");
    } finally {
      setLoading(false);
    }
  }

  const fetchImageAnalysis = async () => {
    const subscriptionKey = '83b81a6cc2a94ba7904a41ee76ab197e';
    const endpoint = 'https://aistudentservice.cognitiveservices.azure.com/';
    const url = `${endpoint}/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2024-02-01`;

    const body = JSON.stringify({
      url: 'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png'
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json'
        },
        body: body
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error fetching image analysis:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <View>
        <Button
          title="Go to Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>

      <Text style={styles.heading}>Vinho MVP</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Vinho</Text>
        <TextInput
          placeholder="Ex: Vinho do Porto 10 anos"
          style={styles.input}
          value={wineName}
          onChangeText={(text) => setWineName(text)}
        />
      </View>
      <Pressable style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Pick an image from camera roll</Text></Pressable>
      <Pressable style={styles.button} onPress={takePhoto}><Text style={styles.buttonText}>Take a photo</Text></Pressable>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Consultar Informações</Text>
        <MaterialIcons name="filter" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando informações...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {wineInfo && (
          <View style={styles.content}>
            <Text style={styles.title}>Informações do Vinho 👇</Text>
            <Text style={{ lineHeight: 24, }}>{wineInfo}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1f1f1'
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
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});