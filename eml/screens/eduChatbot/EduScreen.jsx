import React, { useState } from 'react';
import { View, TextInput, Text, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';

export default function EduScreen() {
	const [isOnline, setIsOnline] = useState(false);
	const [userMessage, setUserMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);

	const sendMessageToChatbot = async () => {
		if (userMessage.trim() === '') return;

		setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userMessage }),
			});

			if (response.ok) {
				const data = await response.json();
				setChatMessages(prevMessages => [...prevMessages, { sender: 'Chatbot', text: data.reply }]);
			} else {
				setChatMessages(prevMessages => [...prevMessages, { sender: 'Chatbot', text: 'Error: Try again.' }]);
			}
		} catch (error) {
			setChatMessages(prevMessages => [...prevMessages, { sender: 'Chatbot', text: 'Error: Try again.' }]);
		}

		setUserMessage('');
	};

	return (
		<>
			<NetworkStatusObserver setIsOnline={setIsOnline} />
			<BaseScreen className="h-screen flex flex-col">
				<IconHeader
					title={'Edu'}
					description={'Inscreva-se nos cursos do seu interesse e comece sua jornada'}
				/>
				{!isOnline ? (
					<View><Text>Offline. Please connect to the internet.</Text></View>
				) : (
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					>
						<ScrollView
							contentContainerStyle={{ padding: 10 }}
							style={{ flex: 1 }}
						>
							{chatMessages.map((message, index) => (
								<View key={index} style={{
									alignSelf: message.sender === 'User' ? 'flex-end' : 'flex-start',
									backgroundColor: message.sender === 'User' ? '#DCF8C6' : '#ECECEC',
									padding: 10,
									marginBottom: 5,
									borderRadius: 5,
								}}>
									<Text>{message.sender}: {message.text}</Text>
								</View>
							))}
						</ScrollView>
						<View style={{
							position: 'absolute',
							bottom: 0,
							width: '100%',
							flexDirection: 'row',
							backgroundColor: 'white',
							padding: 10,
							borderTopWidth: 1,
							borderColor: '#ddd',
						}}>
							<TextInput
								value={userMessage}
								onChangeText={setUserMessage}
								placeholder="Type a message"
								style={{
									flex: 1,
									padding: 10,
									borderWidth: 1,
									borderColor: '#ddd',
									borderRadius: 20,
									marginRight: 10,
								}}
								onSubmitEditing={sendMessageToChatbot}
							/>
							<Button title="Send" onPress={sendMessageToChatbot} />
						</View>
					</KeyboardAvoidingView>
				)}
			</BaseScreen>
		</>
	);
}
