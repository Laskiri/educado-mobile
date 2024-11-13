import React, { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity, Image } from 'react-native';
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
import Tooltip from '../../components/onboarding/onboarding';
import ImageNotFound from '../../assets/images/imageNotFound.png'

export default function SectionScreen({ route }) {
	SectionScreen.propTypes = {
		route: PropTypes.object,
	};
	const { course } = route.params;
	const navigation = useNavigation();
	const [sections, setSections] = useState(null);
	const [studentProgress, setStudentProgress] = useState(0);
	const [sectionProgress, setSectionProgress] = useState({});
	const [currentSection, setCurrentSection] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	async function loadSections(id) {
		const sectionData = await StorageService.getSectionList(id);
		setSections(sectionData);
	}

	const checkProgress = async () => {
		const progress = await checkProgressCourse(course.courseId);
		setStudentProgress(progress);
	};

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
            <View className="flex flex-row flex-wrap justify-between px-6 bg-secondary mb-[5%] ">
                {/* Back Button */}
                <TouchableOpacity className="absolute top-10 left-5 pr-3 z-10" onPress={() => navigation.navigate('Meus cursos')}>
                    <MaterialCommunityIcons name="chevron-left" size={25} color="black" />
                </TouchableOpacity>
                <View className="flex w-full items-center">
                    <View className="flex items-center w-full justify-between">
						<Image class="h-full max-w-full" source={ImageNotFound}/>
                    </View>
                    <View className="flex p-[16px] justify-between w-[293px] h-[119px] rounded-2xl mt-[-12%] mb-[-10%] bg-projectWhite">
                        {/* Course Title */}
                        <Text className="flex text-[24px] font-montserrat font-style-normal line-height-[29px] align-items-center">{course.title}</Text>
                        <View className="relative border-[1px] box-border rounded-sm bg-border"></View>
                        {/* Progress Bar */}
                        <View className="relative w-[261px] h-[20px] ">
                            <CustomProgressBar width={50} progress={studentProgress} height={0.5}></CustomProgressBar>
                        </View>
                        <View className="relative border box-border rounded-sm bg-border"></View>
                        <View className="flex flex-row w-full justify-between">
                            <Text>Points</Text>
                            <CustomProgressBar width={0} progress={studentProgress} height={1}></CustomProgressBar>
                        </View>
                    </View>
                </View>
            </View>
            <View className="flex flex-row items-center pt-8 px-8 gap-2 ">
                {/* Navigate to Current Section Button */}
                <ContinueSection onPress={navigateToCurrentSection} />
            </View>
            {/* Conditionally render the sections if they exist */}
            {sections ? (
                sections.length === 0 ? null : (
                    <View className="flex-[1] flex-col ]">
                        <Tooltip
                            isVisible={isVisible}
                            position={{
                                top: -30,
                                left: 70,
                                right: 30,
                                bottom: 24,
                            }}
                            setIsVisible={setIsVisible}
                            text={'Essa é a página do seu curso. É aqui que você vai acessar as aulas e acompanhar seu progresso.'}
                            tailSide="right"
                            tailPosition="20%"
                            uniqueKey="Sections"
                            uniCodeChar="🎓"
                        />
                        {/* Section Cards */}
                        <ScrollView className="mt-[5%]" showsVerticalScrollIndicator={false}>
                            {sections.map((section, i) => {
                                const completedComponents = sectionProgress[section.sectionId] || 0;
                                return <SectionCard key={i} section={section} course={course} progress={completedComponents}></SectionCard>;
                            })}
                        </ScrollView>
                        {/* Unsubscribe Button */}
                        <SubscriptionCancel onPress={unsubAlert} />
                    </View>
				)
			) : null}
		</>
	);
}