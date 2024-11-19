import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { sendAudioToChatbot } from '../../api/api.js';
import { Icon } from '@rneui/themed';

export default function RecButton({ onAudioResponse }) {
  const [recording, setRecording] = useState(null);

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
        setRecording(null);
        console.log('Recording saved at:', uri);

        // Send the audio to the chatbot
        const result = await sendAudioToChatbot(uri);
        console.log(result.message);

        // Pass the chatbot's response back to the Edu screen
        onAudioResponse(result.message);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  return (
    <TouchableOpacity
      className="rounded-full w-7 h-7 bg-primary_custom ml-2 flex items-center justify-center"
      onPressIn={startRecording}
      onPressOut={stopRecording}
    >
      <Icon
        name="microphone"
        type="material-community"
        color="white"
        size={20}
      />
    </TouchableOpacity>
  );
}
