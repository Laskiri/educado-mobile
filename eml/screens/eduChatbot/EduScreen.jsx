import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import { Icon } from '@rneui/themed';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import Markdown from 'react-native-markdown-display';
import { sendMessageToChatbot as fetchChatbotResponse } from '../../api/api.js';
import { sendAudioToChatbot as fetchTextbotResponse } from '../../api/api.js';

export default function Edubot() {
	const [isOnline, setIsOnline] = useState(false);
	const [userMessage, setUserMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const scrollViewRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [loadingDots, setLoadingDots] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const audioRecorderRef = useRef(null);

	useEffect(() => {
		const requestPermission = async () => {
			const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
			if (status !== 'granted') {
				alert('Microphone permission is required to record audio');
			}
		};

		requestPermission();
	}, []);

	const handleSendMessage = async () => {
		if (!userMessage) return;

		setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]);
		setLoading(true);
		setUserMessage('');

		const chatbotResponse = await fetchChatbotResponse(userMessage);

		setChatMessages(prevMessages => [
			...prevMessages,
			{ sender: 'Chatbot', text: chatbotResponse }
		]);

		setLoading(false);
	};

	const startRecording = async () => {
		try {
			setIsRecording(true);
			audioRecorderRef.current = new Audio.Recording();
			await audioRecorderRef.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
			await audioRecorderRef.current.startAsync();
			console.log('Recording started');
		} catch (error) {
			console.error('Failed to start recording:', error);
			setIsRecording(false);
		}
	};

	const stopRecording = async () => {
		try {
			await audioRecorderRef.current.stopAndUnloadAsync();
			const uri = audioRecorderRef.current.getURI();
			setIsRecording(false);
	
			// Fetch the audio file as a blob
			const response = await fetch(uri);
			const audioBlob = await response.blob();
	
			// Send the audio blob to the chatbot API
			await fetchTextbotResponse(audioBlob);
			console.log('Recording sent to chatbot');
		} catch (error) {
			console.error('Failed to stop or send recording:', error);
		}
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
			<BaseScreen className="h-screen flex flex-col ">
				<View className="border-b " style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.2)' }}>
					<IconHeader 
						title={'Edu'}
						description={'Meu nome é Edu, e estou aqui para ajudá-lo a navegar neste aplicativo.'}
					/>
				</View>
				
				{!isOnline ? (
					<View />
				) : (
					<View className="flex-1 bg-white flex-end">
						<ScrollView ref={scrollViewRef} style={'flex-1'} className="pr-2.5">
							{chatMessages.map((message, index) => (
								message.sender === 'User' ? (
									<View key={index} style={{ alignSelf: 'flex-end' }}>
										<View className="p-2.5 pl-3 mb-1 mt-2 flex-row rounded-t-3xl rounded-bl-3xl max-w-[80%] bg-bgprimary_custom">
											<Text className="text-projectLightGray">{message.text}</Text>
										</View>
									</View>
								) : (
									<View key={index} style={{ alignSelf: 'flex-start' }}>
										<View className="p-2.5 pl-3 mb-1 flex-row rounded-t-3xl rounded-br-3xl max-w-[80%]">
											<View className="px-2">
												<Icon
													name="robot-outline"
													type="material-community"
													color="primary_custom"
													size={20} 
												/>
											</View>
											<Markdown>{message.text}</Markdown> 
										</View>
									</View>
								)
							))}

							{loading && (
								<View style={{ alignSelf: 'flex-start', padding: 10, marginBottom: 5 }}>
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

							{userMessage ? (
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
								<TouchableOpacity
									className="rounded-full w-7 h-7 bg-primary_custom ml-2 flex items-center justify-center"
									onPressIn={startRecording}
									onPressOut={stopRecording}
								>
									<Icon name="microphone" type="material-community" color="white" size={20} />
								</TouchableOpacity>
							)}
						</View>
					</View>
				)}
			</BaseScreen>
		</>
	);
}
