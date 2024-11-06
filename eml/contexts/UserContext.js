import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getUserInfo, getStudentInfo } from '../services/StorageService';
import ShowAlert from '../components/general/ShowAlert';
import errorSwitch from '../components/general/errorSwitch';

/**
 * Provides profile and student information accessible throughout the application.
 */
export const UserContext = createContext();

/**
 * Fetches and provides profile and student information.
 * Utilizes UserContext to make the data accessible throughout the component tree.
 *
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {React.Element} The UserProvider component.
 */
export const UserProvider = ({ children }) => {
	
	UserProvider.propTypes = {
		children: PropTypes.node.isRequired,
	};

	const [profile, setProfile] = useState(null);
	const [student, setStudent] = useState(null);

	// Fetch profile and student info
	const fetchUser = async () => {
		try {
			const fetchedProfile = await getUserInfo();
			const fetchedStudent = await getStudentInfo();
			
			if (fetchedProfile !== null)
				setProfile(fetchedProfile);
		
			if (fetchedStudent !== null)
				setStudent(fetchedStudent);
		} 
		catch (error) {
			ShowAlert(errorSwitch(error));
		}
	};

	// Fetch user data when the component mounts
	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ profile, student, fetchUser }}>
			{children}
		</UserContext.Provider>
	);
};