import React from 'react';
import { View, Text } from 'react-native';
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
		<View className=" self-center w-[100%] h-[70]">
			<Button className="flex w-[100%] rounded-lg"
				mode={'contained'}
				color={tailwindConfig.theme.colors.bgprimary_custom}
				testID="continueSectionButton"
				onPress={onPress}>

			<View className="flex-row items-center justify-center">
                  <Text className="text-white mr-2">Começar curso</Text>
                  <MaterialCommunityIcons
                    testID="play-circle-outline"
                    name="play-circle-outline"
                    size={32}
                    color="white"
                  />
                </View>
                </Button>
		</View>
	);
};

export default ContinueSection;
