import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const App = () => {
  const generatedGifRef = useRef();
  const [selectedGif, setSelectedGif] = useState('');
  const [inputtext, setinputText] = useState('');
  const [generatedgif, setgeneratedgif] = useState(null);

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access media library denied');
        }
      }
    })();
  }, []);

  const selectGif = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedGif(result.assets[0].uri);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const generateGifWithText = async () => {
    console.log('Generate gif called');
    const newTextOverlay = {
      text: inputtext,
      position: 'bottom',
      fontSize: 20,
      color: 'white',
    };
    console.log('Reached gifwithoverlay');
    const gifWithOverlay = (
      <View>
        <Image source={{ uri: selectedGif }} style={styles.gif} />
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: newTextOverlay.fontSize,
              color: newTextOverlay.color,
            }}
          >
            {newTextOverlay.text}
          </Text>
        </View>
      </View>
    );
    setgeneratedgif(gifWithOverlay);
  };

  const capturegif = async () => {
      console.log('Share button clicked');
      const uri = await captureRef(generatedGifRef, {
        quality: 1,
        format: 'png',
      })
      console.log('Going for the share');
      Sharing.shareAsync(uri, {
        mimeType: 'image/gif',
        dialogTitle: 'Share this GIF',
        UTI: 'com.compuserve.gif',
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectGif}>
        <Text style={styles.selectText}>Select GIF</Text>
      </TouchableOpacity>
      {selectedGif && (
        <View>
          <Image source={{ uri: selectedGif }} style={styles.gif} />
          <TextInput
            style={styles.textInput}
            onChangeText={setinputText}
            value={inputtext}
            placeholder="Enter text for overlay"
          />
          <Button title="Generate GIF with Text" onPress={generateGifWithText} />
        </View>
      )}
      {generatedgif && (
        <View>
          <Text>The New GIF with Text is:</Text>
          <ViewShot ref={generatedGifRef}>{generatedgif}</ViewShot>
          <TouchableOpacity onPress={capturegif}>
            <Text style={{ color: 'blue', fontSize: 20 }}>
              Share it!
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'blue',
  },
  gif: {
    width: 300,
    height: 200,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
