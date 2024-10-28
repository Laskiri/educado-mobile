// ChatBotModal.jsx
import React from 'react';
import { View, Text, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

/* const ChatBotModal = ({ visible, onClose }) => {
    const [inputText, setInputText] = useState('');       // User input
    const [responseText, setResponseText] = useState(''); // Chatbot response
  
    const handleSend = async () => {
      if (inputText.trim()) {
        // Display user's message
        setResponseText(`You: ${inputText}`);
        
        try {
          // Send POST request to chatbot backend
          const response = await fetch('https://your-backend-url.com/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: inputText }),
          });
          const data = await response.json();
  
          // Set the bot's response
          setResponseText(`Bot: ${data.reply}`);
        } catch (error) {
          console.error('Error:', error);
          setResponseText('Bot: Sorry, something went wrong. Please try again.');
        }
  
        // Clear input field
        setInputText('');
      }
    };
*/

const ChatBotModal = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-gray-900 bg-opacity-50 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="h-4/5 w-full bg-white rounded-t-3xl p-5 shadow-lg">
                            <Pressable onPress={onClose} className="mb-4">
                                <Text className="text-2xl font-semibold text-black text-center">
                                    ChatBot
                                </Text>
                            </Pressable>
                            <Text className="text-lg text-gray-800">
                                Here you can chat with our virtual assistant!
                            </Text>
                            {/* TEKST INPUT FIELD FOR THE USER*/}
                            <TextInput
                                className="bg-gray-200 text-black px-4 py-2 rounded-lg border border-gray-300"
                                placeholder="Type your message..."
                                value={inputText}
                                onChangeText={setInputText}
                            />
                            {/* Knap, der sender users besked til backend */}
                            <Button title="Send" onPress={handleSend} />

                            {/* Add your ChatBot UI here */}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

ChatBotModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ChatBotModal;
