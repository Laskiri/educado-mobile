import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import RecButton from '../../components/Ai/aiRec';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import { Icon } from '@rneui/themed';
import Markdown from 'react-native-markdown-display';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import { sendMessageToChatbot } from '../../api/api.js';

export default function Edu() {
  const [isOnline, setIsOnline] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  const handleAudioResponse = (audioResponse) => {
    const trimmedUserResponse = audioResponse.message.trim().replace(/[\n\s]+$/, '');
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'User', text: trimmedUserResponse },
    ]);
    const trimmedAiResponse = audioResponse.aiResponse.trim().replace(/[\n\s]+$/, '');
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'Chatbot', text: trimmedAiResponse, audio: audioResponse.audio },
    ]);
  };

  const playAudio = async (base64Audio) => {
    try {
      const audioData = base64Audio.startsWith('data:audio/mpeg;base64,')
        ? base64Audio.split(',')[1]
        : base64Audio;

      const filePath = `${FileSystem.cacheDirectory}chatbotResponse.mp3`;
      await FileSystem.writeAsStringAsync(filePath, audioData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Audio file saved to:', filePath);

      const { sound } = await Audio.Sound.createAsync(
        { uri: filePath },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to save or play audio:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]);
    setLoading(true);
    setUserMessage('');

    const chatbotResponse = await sendMessageToChatbot(userMessage);

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'Chatbot', text: chatbotResponse },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [loading]);

  return (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />
      <BaseScreen className="h-screen flex flex-col">
        <View className="border-b " style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.2)' }}>
          <IconHeader
            title={'Edu'}
            description={'Meu nome é Edu, e estou aqui para ajudá-lo a navegar neste aplicativo.'}
          />
        </View>
        <View className="flex-1 bg-white flex-end">
          <ScrollView
            ref={scrollViewRef}
            style={'flex-1'}
            className="pr-2.5"
          >
            {chatMessages.map((message, index) => (
              message.sender === 'User' ? (
                <View key={index} style={{ alignSelf: 'flex-end' }}>
                  <View className="p-2.5 pl-3 mb-1 mt-2 flex-row rounded-t-3xl rounded-bl-3xl max-w-[80%] bg-bgprimary_custom">
                    <Text className="text-projectLightGray">{message.text}</Text>
                  </View>
                </View>
              ) : (
                <View key={index} style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                  <View className="p-2.5 pl-3 mb-1 flex-row rounded-t-3xl rounded-br-3xl max-w-[80%]">
                    <View className="px-2">
                      <Icon
                        name="robot-outline"
                        type="material-community"
                        color="primary_custom"
                        size={20}
                      />
                    </View>
					<View className="">
						<Markdown >{message.text}</Markdown>
					</View>
                    {message.audio && (
						<View className="pl-2 self-center">
							<TouchableOpacity
								onPress={() => playAudio(message.audio)}
								className=""
							>
							<Icon
								name="play-circle-outline"
								type="material-community"
								color="primary_custom"
								size={32}
							/>
							</TouchableOpacity>
						</View>
                    
                  	)}
                  </View>
                  
                </View>
              )
            ))}
            {loading && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Icon
                  name="robot-outline"
                  type="material-community"
                  color="primary_custom"
                  size={20}
                />
                <Text>Edu is thinking{loadingDots}</Text>
              </View>
            )}
          </ScrollView>
          <View className="flex-row border border-projectBlack rounded-3xl m-4 p-1 pl-4">
            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder={'Pesquise aqui...'}
              className="flex-1"
              onSubmitEditing={handleSendMessage}
            />
            {userMessage.trim() ? (
              <TouchableOpacity
                className="rounded-full w-7 h-7 bg-primary_custom ml-2 flex items-center justify-center"
                onPress={handleSendMessage}
              >
                <Icon
                  name="arrow-up"
                  type="material-community"
                  color="white"
                  size={20}
                />
              </TouchableOpacity>
            ) : (
              <RecButton onAudioResponse={handleAudioResponse} />
            )}
          </View>
        </View>
      </BaseScreen>
    </>
  );
}
