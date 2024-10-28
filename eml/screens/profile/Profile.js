// ProfileComponent.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
	View,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import LogOutButton from '../../components/profile/LogOutButton';
import ProfileNavigationButton from '../../components/profile/ProfileNavigationButton';
import UserInfo from '../../components/profile/UserInfo';
import { useNavigation } from '@react-navigation/native';
import { getUserInfo, getStudentInfo } from '../../services/StorageService';
import errorSwitch from '../../components/general/errorSwitch';
import ShowAlert from '../../components/general/ShowAlert';
import ProfileStatsBox from '../../components/profile/ProfileStatsBox';
import { useFocusEffect } from '@react-navigation/native';
import ChatBotModal from '../../components/chatBot';

export default function ProfileComponent() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [photo, setPhoto] = useState('');
	const navigation = useNavigation();
	const [studentLevel, setStudentLevel] = useState(0);
	const [levelProgress, setLevelProgress] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);

	// State to control the ChatBot modal visibility
	const [chatBotModalVisible, setChatBotModalVisible] = useState(false);

	useEffect(() => {
		const getInfo = navigation.addListener('focus', () => {
			getProfile();
		});
		return getInfo;
	}, [navigation]);

	const getLevelProgress = (student) => {
		const pointsForPreviousLevel = (student.level - 1) * 100;
		const pointsForNextLevel = student.level * 100;

		return ((student.points - pointsForPreviousLevel) / (pointsForNextLevel - pointsForPreviousLevel)) * 100;
	};

	const getProfile = async () => {
		try {
			const fetchedProfile = await getUserInfo();
			const fetchedStudent = await getStudentInfo();
			if (fetchedProfile !== null) {
				setFirstName(fetchedProfile.firstName);
				setLastName(fetchedProfile.lastName);
				setEmail(fetchedProfile.email);
				if (fetchedStudent !== null) setPhoto(fetchedStudent.photo);
			} else if (fetchedStudent !== null) {
				setStudentLevel(fetchedStudent.level);
				setTotalPoints(fetchedStudent.points);
				setLevelProgress(getLevelProgress(fetchedStudent));
			}
		} catch (error) {
			ShowAlert(errorSwitch(error));
		}
	};

	useFocusEffect(
		useCallback(() => {
			const runAsyncFunction = async () => {
				try {
					await getProfile();
				} catch (error) {
					console.error('Error fetching profile:', error);
				}
			};

			runAsyncFunction();
		}, [])
	);

	const fetchStudentProfile = async () => {
		const studentInfo = await getStudentInfo();
		setStudentLevel(studentInfo.level);
		setTotalPoints(studentInfo.points);
		setLevelProgress(getLevelProgress(studentInfo));
	};

	useEffect(() => {
		fetchStudentProfile();
	}, []);

	return (
		<SafeAreaView className="bg-secondary">
			<ScrollView className="flex flex-col">
				<View className="flex-1 justify-start pt-[20%] h-screen">
					<UserInfo firstName={firstName} lastName={lastName} email={email} points={totalPoints} photo={photo}></UserInfo>
					<ProfileStatsBox studentLevel={studentLevel} levelProgress={levelProgress} />
					<ProfileNavigationButton
						label="Editar perfil"
						testId={'editProfileNav'}
						onPress={() => navigation.navigate('EditProfile')}
					/>
					<ProfileNavigationButton
						label="ChatBot"
						testId={'chatBotNav'}
						onPress={() => setChatBotModalVisible(true)}
					/>
					<View className="flex flex-row pb-4">
						<LogOutButton testID="logoutBtn" />
					</View>
				</View>
			</ScrollView>

			{/* Render the ChatBotModal */}
			<ChatBotModal
				visible={chatBotModalVisible}
				onClose={() => setChatBotModalVisible(false)}
			/>
		</SafeAreaView>
	);
}
