import React, { useState } from 'react';
import { View, Pressable, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import Collapsible from 'react-native-collapsible';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';


/**
 * A component that displays a section card with collapsible content.
 * @param {Object} section - The section object containing the section data.
 * @param {Object} course - The course object containing the course data.
 * @param {Number} progress - The progress containing the student's progress.
 * @param {Function} onPress - The callback function to navigate
 * @returns {JSX.Element} - The SectionCard component.
 */
export default function SectionCard({ section, course, progress, onPress }) {


	const navigation = useNavigation();
	const isComplete = progress === section.components.length;
	const inProgress = 0 < progress && progress < section.components.length;
	const notPossible = progress > section.components.length;
	const [isOpen, setIsOpen] = useState(false);
	const backgroundColor = notPossible ? 'bg-error' : {};
	const progressText = isComplete ? 'Concluído' : inProgress ? 'Em progresso' : 'Não iniciado';
    const progressTextColor = isComplete ? 'text-success' : 'text-projectBlack';

	/**
		 * Toggles the dropdown state.
		 */
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};


	/**
		 * Handles the image press event.
		 */
	const handleImagePress = () => {
		navigation.navigate('Components', {
			section: section,
			parsedCourse: course,
		});
	};


	return (
		<View>
			<TouchableOpacity
				className="bg-secondary border-[1px] border-lightGray rounded-lg shadow-lg shadow-opacity-[0.3] mb-[15] mx-[18] overflow-hidden elevation-[8]"
				onPress={onPress}
			>
				<View className="flex-row items-center justify-between px-[25] py-[15]">
					<View>
						<Text className="text-[16px] font-bold text-projectBlack flex-[1]">
                            {section.title}
                        </Text>
                        <Text className={`mr-[10] ${progressTextColor}`}>
                            {/* progress */}
                            {progress}/{section.components.length} {progressText}
                            {(isComplete ?
                                <MaterialCommunityIcons
                                    testID={'check-circle'}
                                    name={'check-circle'}
                                    size={16}
                                    color="green"
                                /> : ""
                            )}
                        </Text>
					</View>
					<MaterialCommunityIcons
						testID="chevron-right"
						name="chevron-right"
						size={25}
						color="gray"
					/>
				</View>
			</TouchableOpacity>
			
		</View>
	);
}

SectionCard.propTypes = {
	section: PropTypes.object,
	course: PropTypes.object,
	progress: PropTypes.number,
};