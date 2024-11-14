import axios from 'axios';
import { CERTIFICATE_URL } from '@env';
import { getCourse } from '../api/api.js';
import { getUserInfo } from './StorageService.js';
import { getStudentInfo } from '../api/userApi.js';

// Get certificates from student
export const fetchCertificates = async (userId) => {
	try {
		if (!userId) {
			throw new Error('User ID is null');
		}
		const res = await axios.get(`${CERTIFICATE_URL}/api/student-certificates/student/${userId}`);
		return res.data;
	} catch (error) {
		// Check if the error has a response from the server
		if (error.response) {
			const status = error.response.status;
			const data = error.response.data;

			if (status === 404) {
				console.error('Endpoint not found:', data.message || 'No further information');
				throw new Error('Certificates endpoint is not implemented or accessible.');
			} else if (status >= 500) {
				console.error('Server error:', data.message || 'No further information');
				throw new Error('A server error occurred. Please try again later.');
			} else {
				throw new Error(data || 'An error occurred while fetching certificates.');
			}
		} else if (error.request) {
			// Request was made, but no response was received
			console.error('No response from server', error.request);
			throw new Error('Network error: Unable to reach server.');
		} else {
			// Some other error occurred in setting up the request
			console.error('Unexpected error:', error.message);
			throw new Error('An unexpected error occurred.');
		}
	}
};

/* Generates a certificate for a student.
 * @param {string} courseId - The ID of the course.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - The response from the server.
 */
export const generateCertificate = async (courseId, userId) => {
	try {
		// Fetch course data
		const courseData = await getCourse(courseId);

		// Fetch student data and user data concurrently
		const [studentData, userData] = await Promise.all([
			getStudentInfo(userId),
			getUserInfo(),
		]);

		// Ensure data is loaded
		if (!courseData || !studentData || !userData) {
			throw new Error('Course, student, or user data not loaded');
		}

		const object = {
			courseName: courseData.title,
			courseId: courseData._id,
			studentId: studentData._id,
			studentFirstName: userData.firstName,
			studentLastName: userData.lastName,
			courseCreator: courseData.creator,
			estimatedCourseDuration: courseData.estimatedHours || 0,
			dateOfCompletion: new Date().toISOString().split('T')[0], // current date
			courseCategory: courseData.category,
		};

		// Call the endpoint to generate the certificate
		const response = await axios.put(`${CERTIFICATE_URL}/api/student-certificates`, object);
		return response.data;
	} catch (error) {
		if (error.response) {
			const status = error.response.status;
			const data = error.response.data;

			if (status === 404) {
				console.error('Certificate generation endpoint not found:', data.message || 'No further information');
				throw new Error('Certificate generation endpoint is not implemented.');
			} else if (status >= 500) {
				console.error('Server error during certificate generation:', data.message || 'No further information');
				throw new Error('Server error: Unable to generate certificate at this time.');
			} else {
				console.error('Certificate generation failed:', data.message || 'Unknown error');
				throw new Error(data.message || 'An error occurred during certificate generation.');
			}
		} else if (error.request) {
			console.error('No response received for certificate generation:', error.request);
			throw new Error('Network error: Unable to reach certificate generation endpoint.');
		} else {
			console.error('Unexpected error during certificate generation:', error.message);
			throw new Error('An unexpected error occurred during certificate generation.');
		}
	}
};
