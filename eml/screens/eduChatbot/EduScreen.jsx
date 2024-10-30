import React from 'react';
import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Button, Text, Platform } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import axios from 'axios';

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export default function Explore() {

	const [isOnline, setIsOnline] = useState(false);
	const [userMessage, setUserMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);

	

const sendMessageToChatbot = async () => {
    if (!userMessage) return;

    setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]);

    try {
        const response = await axios.post(`http://172.30.252.126:8888/api/ai`, {
            userInput: userMessage,
            currentPage: 'Explore'
        });

        if (response.status === 200) {
            setChatMessages(prevMessages => [
                ...prevMessages,
                { sender: 'Chatbot', text: response.data.message }
            ]);
        } else {
            setChatMessages(prevMessages => [
                ...prevMessages,
                { sender: 'Chatbot', text: 'Error: Try again.' }
            ]);
        }
    } catch (error) {
        console.warn('Axios error:', error);
        setChatMessages(prevMessages => [
            ...prevMessages,
            { sender: 'Chatbot', text: 'Error: Try again.' }
        ]);
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
				{!isOnline ?
					<View>
						
					</View>
					:
					<View className="flex-1 bg-white flex justify-end">
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

						<TextInput
							value={userMessage}
							onChangeText={setUserMessage}
                            placeholder={'Pesquise aqui...'}
                            className="flex bg-blue border-2 rounded-3xl m-4 py-2 px-4"
							onSubmitEditing={sendMessageToChatbot}
                        />
						<Button title="Send" onPress={sendMessageToChatbot} />
					</View>
				}
			</BaseScreen>
		</>
	);
}

