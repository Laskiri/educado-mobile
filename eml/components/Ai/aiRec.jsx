import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { sendAudioToChatbot} from '../../api/api.js';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [audioSource, setAudioSource] = useState(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Audio recording permission is required.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioSource(uri); // Store the URI
        setRecording(null);
        console.log('Recording saved at:', uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playAudio = async () => {

    if (audioSource) {
      try {
        console.log(audioSource)
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        
        
        // Create and play the sound
        const { sound: playbackObject } = await Audio.Sound.createAsync(
          { uri: audioSource },
          { shouldPlay: true } // Automatically start playback
        );

        console.log('Playing audio...');
        playbackObject.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            playbackObject.unloadAsync(); // Unload sound after playback
          }
        });
      } catch (error) {
        console.error('Failed to play audio', error);
      }
    } else {
      Alert.alert('No Audio', 'Please record some audio first!');
    }
    const result = await sendAudioToChatbot(audioSource);
    console.log(result.message)
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button title="Play Audio" onPress={playAudio} disabled={!audioSource} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
});
