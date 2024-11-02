import { View, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Text from '../../../components/general/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomProgressBar from '../../exercise/Progressbar';
import tailwindConfig from '../../../tailwind.config';
import { determineIcon, determineCategory, formatHours, checkProgressCourse} from '../../../services/utilityFunctions';
import DownloadCourseButton from './DownloadCourseButton';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';

/**
 * CourseCard component displays a card for a course with its details
 * @param {Object} props - Component props
 * @param {Object} props.course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
export default function CourseCard({ course, isOnline }) {
	const [downloaded, setDownloaded] = useState(false);
	const navigation = useNavigation();
	const [studentProgress, setStudentProgress] = useState(0);

	const checkDownload = async () => {
		setDownloaded(await checkCourseStoredLocally(course.courseId));
	};
	checkDownload();

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	};
	checkProgress();

	const enabledUI = 'rounded-lg overflow-hidden m-[3%] elevation-[2] mx-[5%] relative';
	const disabledUI = 'rounded-lg overflow-hidden opacity-50 m-[3%] elevation-[2] mx-[5%]';

	const layout = downloaded || isOnline ? enabledUI : disabledUI;

	let isDisabled = layout === disabledUI;
	course.image = require('../../../assets/images/sectionThumbnail.png'); // Temporary image

	return (
		<Pressable testID="courseCard"
			className={layout}
			onPress={() => {
				layout === enabledUI ?
					navigation.navigate('Section', {
						course: course,
					}) : null;
			}}
		>
			<View className={`relative ${course.image ? 'h-[250px]' : 'w-auto h-auto'}`}>
				{course.image &&
					<Image
						source={course.image}
						resizeMode={'cover'}
						className="absolute top-0 left-0 right-0 w-full h-full rounded-t-lg"
					/>
				}
				<View className={`${course.image ? 'absolute bottom-0 left-0 right-0 p-[5%]' : 'p-[5%] bg-projectWhite rounded-lg'}`}>
					{course.image && (
						<View className="absolute top-0 left-0 right-0 bottom-0 bg-projectWhite" style={{ opacity: 0.95 }} />
					)}
					<View className="relative">
						<View className="flex-row items-start justify-between px-[1%] py-[1%]">
							<Text className="text-[18px] text-projectBlack flex-1 self-center font-montserrat-semi-bold">
								{course.title ? course.title : 'Título do curso'}
							</Text>
							<View className="flex-2 pr-6">
								<DownloadCourseButton course={course} disabled={isDisabled} />
							</View>
						</View>
						<View className="h-[1] bg-disable m-[2%]" />
						<View className="flex-row flex-wrap items-center justify-start">
							<View className="flex-row items-center">
								<MaterialCommunityIcons size={18} name={determineIcon(course.category)} color={'gray'}></MaterialCommunityIcons>
								<Text className="mx-[2.5%] my-[3%]">{determineCategory(course.category)}</Text>
							</View>
							<View className="flex-row items-center">
								<MaterialCommunityIcons size={18} name="clock" color={'gray'}></MaterialCommunityIcons>
								<Text className="mx-[2.5%] my-[3%]">{course.estimatedHours ? formatHours(course.estimatedHours) : 'duração'}</Text>
							</View>
						</View>
						<View className="flex-row items-center">
							<CustomProgressBar width={56} progress={studentProgress} height={1} />
							<Pressable className="z-[1]"
								onPress={() => {
									layout === enabledUI ?
										navigation.navigate('Section', {
											course: course,
										}) : null;
								}}
							>
								<MaterialCommunityIcons size={28} name="play-circle" color={tailwindConfig.theme.colors.primary_custom}></MaterialCommunityIcons>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	);
}

CourseCard.propTypes = {
	course: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
	]),
	isOnline: PropTypes.bool
};

