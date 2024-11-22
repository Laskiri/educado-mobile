import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { sendFeedbackToBackend } from '../../api/api';

const FeedbackButtons = ({ aiText, userText }) => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const handleFeedback = async (type) => {
        const feedback = type === 'thumbsUp'; // thumbsUp -> true, thumbsDown -> false
        setSelectedFeedback(type); // Update UI state to show the selected feedback

        try {
            // Call the API function
            const result = await sendFeedbackToBackend(userText, aiText, feedback);
            if (result.success) {
                console.log('Feedback sent successfully!');
            } else {
                console.error('Error sending feedback:', result.error);
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity onPress={() => handleFeedback('thumbsUp')}>
                <Icon
                    name="thumb-up-outline"
                    type="material-community"
                    color={selectedFeedback === 'thumbsUp' ? 'blue' : 'black'} // Highlight thumbs-up if selected
                    size={16}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFeedback('thumbsDown')}>
                <Icon
                    name="thumb-down-outline"
                    type="material-community"
                    color={selectedFeedback === 'thumbsDown' ? 'red' : 'black'} // Highlight thumbs-down if selected
                    size={16}
                />
            </TouchableOpacity>
        </View>
    );
};

export default FeedbackButtons;
