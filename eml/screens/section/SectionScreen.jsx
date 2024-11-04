import React, { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import Text from '../../components/general/Text';
import * as StorageService from '../../services/StorageService';
import SectionCard from '../../components/section/SectionCard';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomProgressBar from '../../components/exercise/Progressbar';
import SubscriptionCancel from '../../components/section/CancelSubscriptionButton';
import { unsubscribe } from '../../services/StorageService';
import PropTypes from 'prop-types';
import { checkProgressCourse, checkProgressSection } from '../../services/utilityFunctions';
import ContinueSection from '../../components/section/ContinueSectionButton';

export default function SectionScreen({ route }) {
	SectionScreen.propTypes = {
		route: PropTypes.object,
	};
	const { course } = route.params;
	const navigation = useNavigation();
	const [sections, setSections] = useState(null);
	const [studentProgress, setStudentProgress] = useState(0);
<<<<<<< HEAD
	const [completedComponents, setCompletedComponents] = useState([]);
=======
	const [sectionProgress, setSectionProgress] = useState({});
	const [currentSection, setCurrentSection] = useState(null);
>>>>>>> origin/dev

	async function loadSections(id) {
		const sectionData = await StorageService.getSectionList(id);
		setSections(sectionData);
	}

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	};

<<<<<<< HEAD
	/**
	 * Fetch and set progress for each section in bulk to avoid re-renders
	 */
	const loadAllSectionProgress = async () => {
		if (sections) {
			// Map over each section ID and fetch their progress
			const progressArray = await Promise.all(
				sections.map(section => checkProgressSection(section.sectionId))
			);
			setCompletedComponents(progressArray);
		}
	};

	useEffect(() => {
		// this makes sure checkProgress is called when the screen is focused
		const update = navigation.addListener('focus', () => {
			checkProgress();
		});
		return update;
	}, [navigation]);

	// Fetch sections from backend and progress for each section
	useEffect(() => {
		const loadData = async () => {
			await loadSections(course.courseId);
			checkProgress();  // Load total course progress
			await loadAllSectionProgress();  // Load progress for each section
		};
		loadData();
	}, [sections]);
=======
	const checkProgressInSection = async (sectionId) => {
		const completed = await checkProgressSection(sectionId);
		setSectionProgress(prevProgress => ({
			...prevProgress,
			[sectionId]: completed,
		}));
	};

	useEffect(() => {
		let componentIsMounted = true;

		async function loadData() {
			await loadSections(course.courseId);
		}

		if (componentIsMounted) {
			loadData();
		}

		return () => {
			componentIsMounted = false;
		};
	}, []);
>>>>>>> origin/dev

	useEffect(() => {
		if (sections) {
			sections.forEach(section => {
				checkProgressInSection(section.sectionId);
			});
		}
	}, [sections]);

	useEffect(() => {
		if (sections) {
			const incompleteSection = sections.find(section => {
				const completedComponents = sectionProgress[section.sectionId] || 0;
				return completedComponents < section.components.length;
			});
			setCurrentSection(incompleteSection);
		}
	}, [sectionProgress, sections]);

	useEffect(() => {
		const update = navigation.addListener('focus', () => {
			checkProgress();
			if (sections) {
				sections.forEach(section => {
					checkProgressInSection(section.sectionId);
				});
			}
		});
		return update;
	}, [navigation]);

	const unsubAlert = () =>
		Alert.alert('Cancelar subscrição', 'Tem certeza?', [
			{
				text: 'Não',
				style: 'cancel',
			},
			{ text: 'Sim', onPress: () => { unsubscribe(course.courseId); setTimeout(() =>  {navigation.navigate('Meus cursos');}, 300 ); }},
		]);

	const navigateToCurrentSection = () => {
		if (currentSection) {
			navigation.navigate('Components', {
				section: currentSection,
				parsedCourse: course,
			});
		}
	};

	return (
		<>
			<View className="flex flex-row flex-wrap items-center justify-between px-6 pt-[20%]">
				{/* Back Button */}
				<TouchableOpacity className="pr-3" onPress={() => navigation.navigate('Meus cursos')}>
					<MaterialCommunityIcons name="chevron-left" size={25} color="black" />
				</TouchableOpacity>
				{/* Course Title */}
				<Text className="text-[25px] font-bold">{course.title}</Text>
			</View>
			{/* Conditionally render the sections if they exist */}
			{sections ? (
				sections.length === 0 ? null : (
					<View className="flex-[1] flex-col my-[10px]">
						{/* Progress Bar */}
						<CustomProgressBar width={60} progress={studentProgress} height={3}></CustomProgressBar>
						{/* Section Cards */}
						<ScrollView className="mt-[5%]" showsVerticalScrollIndicator={false}>
<<<<<<< HEAD
							{sections.map((section, i) => (
								<SectionCard key={i} section={section} course={course} progress={completedComponents[i] || 0}></SectionCard>
							))}
=======
							{sections.map((section, i) => {
								const completedComponents = sectionProgress[section.sectionId] || 0;
								return <SectionCard key={i} section={section} course={course} progress={completedComponents}></SectionCard>;
							})}
>>>>>>> origin/dev
						</ScrollView>
						{/* Unsubscribe Button */}
						<SubscriptionCancel onPress={unsubAlert} />
						{/* Navigate to Current Section Button */}
						<ContinueSection onPress={navigateToCurrentSection} />
					</View>
				)
			) : null}
<<<<<<< HEAD
		</BaseScreen>
=======
		</>
>>>>>>> origin/dev
	);
}