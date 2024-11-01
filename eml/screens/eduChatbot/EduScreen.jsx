import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import BaseScreen from '../../components/general/BaseScreen';
import IconHeader from '../../components/general/IconHeader';
import NetworkStatusObserver from '../../hooks/NetworkStatusObserver';
import axios from 'axios';
import { Icon } from '@rneui/themed';

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export default function Explore() {

	const [isOnline, setIsOnline] = useState(false);
	const [userMessage, setUserMessage] = useState('');
	const [chatMessages, setChatMessages] = useState([]);
	const scrollViewRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [loadingDots, setLoadingDots] = useState('');

	

	const sendMessageToChatbot = async () => {
		if (!userMessage) return;

		setChatMessages([...chatMessages, { sender: 'User', text: userMessage }]);
		setLoading(true);

		try {
			const response = await axios.post(`http://192.168.0.165:8888/api/ai`, {
				userInput: userMessage
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
		setLoading(false);
	};

	useEffect(() => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}
	}, [chatMessages]);
	
	
	
	useEffect(() => {
		if (loading){
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
				<IconHeader
					title={'Edu, ur ai assistant'}
					description={'My name is Edu, and im here to help u bozos nagivgating this shit app'}
				/>
				{!isOnline ?
					<View>
						
					</View>
					:
					<View className="flex-1 bg-white flex-end">
						<ScrollView
							ref={scrollViewRef}
							style={'flex-1'}
							className="pr-2.5"
							>
								{chatMessages.map((message, index) => (
									<View key={index} 
										
										className=" p-2.5 mb-1 mx-4 flex-row flex-end rounded-t-3xl rounded-bl-3xl max-w-[80%]" style={{
										alignSelf: message.sender === 'User' ? 'flex-end' : 'flex-start',
										backgroundColor: message.sender === 'User' ? '#A1ACB2' : '',
										
									}}>
										{message.sender === 'Chatbot' && (
											<View className ="px-2">
												<Icon
												name="robot-outline"
												type="material-community"
												color="primary_custom"
												size={20}
												/>
											</View>
										)}
										<Text >{message.text}</Text>
									</View>
								))}

								
								{/* Display loading indicator if loading */}
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
						<View className="flex-row border rounded-3xl m-4 p-1 pl-4">
							<TextInput
								value={userMessage}
								onChangeText={setUserMessage}
								placeholder={'Pesquise aqui...'}
								className="flex-1"
								onSubmitEditing={sendMessageToChatbot}
							/>
							<TouchableOpacity
								className="rounded-full w-7 h-7 bg-primary_custom ml-2 flex items-center justify-center"
								onPress={sendMessageToChatbot}
							>
								<Icon
								name="arrow-up"
								type="material-community"  // or any other icon library type, like 'font-awesome'
								color="white"    // set icon color
								size={20}        // set icon size
								/>
							</TouchableOpacity>
						</View>
					</View>
				}
			</BaseScreen>
		</>
	);
}

