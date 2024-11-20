import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import tailwindConfig from '../../tailwind.config';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Renders a button component for continuing a section.
 * @param {Function} onPress - The function to be called when the button is pressed.
 * @returns {JSX.Element} - The rendered component.
 */
const ContinueSection = ({ onPress }) => {
	ContinueSection.propTypes = {
		onPress: PropTypes.func.isRequired,
	};

	return (
		<View className="self-center w-[100%] h-[70]">
			<TouchableOpacity className="bg-bgprimary_custom flex w-[100%] rounded-lg" onPress={onPress}>
			    <View className="flex-row items-center justify-center p-4">
                    <Text className="font-montserrat-bold text-projectWhite text-xl mr-2">Começar curso</Text>
                    <MaterialCommunityIcons
                        testID="play-circle-outline"
                        name="play-circle-outline"
                        size={32}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
		</View>
	);
};

export default ContinueSection;
