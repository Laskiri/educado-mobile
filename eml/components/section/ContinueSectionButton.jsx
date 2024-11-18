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
		<View className=" self-center justify-center w-[100%] h-[70]">
			<Button className="flex flex-row h-14 m-2 justify-center self-center items-center rounded-lg"
				mode={'contained'}
				color={tailwindConfig.theme.colors.bgprimary_custom}
				testID="continueSectionButton"
				onPress={onPress}
			>
              Continuar seção
              "icon"
			</Button>
		</View>
	);
};

export default ContinueSection;
