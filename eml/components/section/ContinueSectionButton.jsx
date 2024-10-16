import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import tailwindConfig from '../../tailwind.config';
import PropTypes from 'prop-types';

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
		<View className="py-4 self-center justify-end">
			<Button
				mode={'contained'}
				color={tailwindConfig.theme.colors.success}
				testID="continueSectionButton"
				onPress={onPress}
			>
              Continue Section
			</Button>
		</View>
	);
};

export default ContinueSection;
