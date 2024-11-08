import React, { useEffect, useState, useCallback } from 'react';
import ToastNotification from '../../components/general/ToastNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import LogOutButton from '../../components/profile/LogOutButton';
import ProfileNavigationButton from '../../components/profile/ProfileNavigationButton.js';
import UserInfo from '../../components/profile/UserInfo';
import { useNavigation } from '@react-navigation/native';
import { getUserInfo, getStudentInfo } from '../../services/StorageService';
import errorSwitch from '../../components/general/errorSwitch';
import ShowAlert from '../../components/general/ShowAlert';
import ProfileStatsBox from '../../components/profile/ProfileStatsBox';
import { useFocusEffect } from '@react-navigation/native';
import Tooltip from '../../components/onboarding/onboarding';

/**
 * Profile screen
 * @returns {React.Element} Component for the profile screen
 */
export default function ProfileComponent() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [photo, setPhoto] = useState('');
	const navigation = useNavigation();
	const [studentLevel, setStudentLevel] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);
	const [streak, setStreak] = useState(0);	// Number of days in a row with points gained
	const [leaderboardPosition, setLeaderboardPosition] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const getInfo = navigation.addListener('focus', () => {
			getProfile();
		});
		return getInfo;
	}, [navigation]);

	/**
  * Fetches the user's profile from local storage
  */
	const getProfile = async () => {
		try {
			const fetchedProfile = await getUserInfo();
			const fetchedStudent = await getStudentInfo();
			
			if (fetchedProfile !== null) {
				setFirstName(fetchedProfile.firstName);
				setLastName(fetchedProfile.lastName);
				setEmail(fetchedProfile.email);
				
				if (fetchedStudent !== null) 
					setPhoto(fetchedStudent.photo);
			} 
			
			if (fetchedStudent !== null) {
				setStudentLevel(fetchedStudent.level);
				setTotalPoints(fetchedStudent.points);
			}
		} catch (error) {
			ShowAlert(errorSwitch(error));
		}
	};
	
	useFocusEffect(
		useCallback(() => {
			console.log('Profile screen focused');
			const runAsyncFunction = async () => {
				try {
					// Load profile data and check for password reset status
					await getProfile();
					await checkPasswordReset();
				} catch (error) {
					console.error('Error fetching profile:', error);
				}
			};
	
			// Run the async function when the screen is focused
			runAsyncFunction();
		}, [])
	);

	const checkPasswordReset = async () => {
		try {
			console.log('Checking password reset');
			if (await AsyncStorage.getItem('passwordUpdated') == 'true') {
				ToastNotification('success', 'Senha alterada com sucesso');
				await AsyncStorage.setItem('passwordUpdated', 'false');
				return;
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<View className='flex flex-col pt-[20%] px-[5%] pb-[5%] bg-secondary'>
			<UserInfo firstName={firstName} lastName={lastName} email={email} photo={photo}></UserInfo>
			<ProfileStatsBox 
				streak={streak || 0}
				points={totalPoints || 0} 
				leaderboardPosition={leaderboardPosition || 0}
				level={studentLevel || 0} 
				drawProgressBarOnly={false} 
			/>
			<Tooltip 
				isVisible={isVisible} 
				position={{
					top: -300,
					left: 70,
					right: 30,
					bottom: 24,
				}} 
				setIsVisible={setIsVisible} 
				text={'Você está no seu perfil, onde pode acessar suas informações, visualizar certificados e realizar outras atividades.'} 
				tailSide="right"
				tailPosition="20%" 
				uniqueKey="Profile" 
				uniCodeChar="👩‍🏫"
			/>
			
			<ProfileNavigationButton label='Editar perfil' testId={'editProfileNav'} onPress={() => navigation.navigate('EditProfile')}></ProfileNavigationButton>
			<ProfileNavigationButton label='Certificados' onPress={() => navigation.navigate('Certificate')}></ProfileNavigationButton>

			{/* Download page is not implemented yet. However, download works and can be accessed on home page when offline */}
			<ProfileNavigationButton label='Download'></ProfileNavigationButton>
			<ProfileNavigationButton label='Alterar senha' testId={'editPasswordNav'} onPress={() => navigation.navigate('EditPassword')}></ProfileNavigationButton>

			<View className='flex flex-row pb-4'>
				<LogOutButton testID='logoutBtn'></LogOutButton>
			</View>
		</View>
	);
}