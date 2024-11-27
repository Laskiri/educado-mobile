import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import PropTypes from 'prop-types';


/**
 * A component that displays a section card with collapsible content.
 * @param {Object} section - The section object containing the section data.
 * @param {Number} progress - The progress containing the student's progress.
 * @param {Function} onPress - The callback function to navigate
 * @returns {JSX.Element} - The SectionCard component.
 */
export default function SectionCard({ section, progress, onPress }) {


	const isComplete = progress === section.components.length;
	const inProgress = 0 < progress && progress < section.components.length;
	const progressText = isComplete ? 'Concluído' : inProgress ? 'Em progresso' : 'Não iniciado';
	const progressTextColor = isComplete ? 'text-success' : 'text-projectBlack';


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
								/> : ''
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
	progress: PropTypes.number,
	onPress: PropTypes.func,
};