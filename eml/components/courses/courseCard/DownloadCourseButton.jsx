import React, { useEffect, useState } from 'react';
import {Image ,Alert, View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import * as StorageService from '../../../services/StorageService';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';
import trashCanOutline from '../../../assets/images/trash-can-outline.png';
import fileDownload from '../../../assets/images/file_download.png';

/**
 * DownloadCourseButton component displays a button that downloads a course
 * @param {object} props - Props containing the course the button is on
 * @returns {JSX.Element} - The DownloadCourseButton component
 */
const DownloadCourseButton = ({ course, disabled }) => {
	const [isDownloaded, setIsDownloaded] = useState(false);
  
	useEffect(() => {
	  // Check if the course is downloaded when the component mounts
	  const checkIfDownloaded = async () => {
		const result = await checkCourseStoredLocally(course.courseId);
		setIsDownloaded(result);
	  };
	  checkIfDownloaded();
	}, [course.courseId]);
  
	const downloadConfirmation = () =>
	  Alert.alert('Baixar curso', 'Tem certeza de que deseja baixar este curso?', [
		{
		  text: 'Cancelar',
		  style: 'cancel',
		},
		{
		  text: 'Baixar',
		  onPress: async () => {
			const result = await StorageService.storeCourseLocally(course.courseId);
			if (result) {
			  setIsDownloaded(true);
			} else {
			  alert('Não foi possível baixar o curso. Certifique-se de estar conectado à Internet.');
			}
		  },
		},
	  ]);
  
	const removeDownloadConfirmation = () =>
	  Alert.alert('Remover curso', 'Tem certeza de que deseja remover este curso baixado?', [
		{
		  text: 'Cancelar',
		  style: 'cancel',
		},
		{
		  text: 'Remover',
		  onPress: async () => {
			const result = await StorageService.deleteLocallyStoredCourse(course.courseId);
			if (result) {
			  setIsDownloaded(false);
			} else {
			  alert('Algo deu errado. Não foi possível remover os dados armazenados do curso.');
			}
		  },
		  style: 'destructive',
		},
	  ]);
  
	const handlePress = () => {
	  if (disabled) {
		return;
	  }
	  if (!isDownloaded) {
		downloadConfirmation();
	  } else {
		removeDownloadConfirmation();
	  }
	};

    return (
    <TouchableOpacity onPress={handlePress} disabled={disabled}>
      <View style={styles.iconContainer}>
        {isDownloaded ? (
          <Image source={trashCanOutline} style={styles.deleteIcon} />
        ) : (
          <Image source={fileDownload} style={styles.downloadIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,           // Set a fixed width
    height: 30,          // Set a fixed height
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    width: 30,           
    height: 30,          
  },
  deleteIcon: {
	width: 22,           
	height: 26,          
  },
});

DownloadCourseButton.propTypes = {
    course: PropTypes.object,
    disabled: PropTypes.bool,
};

export default DownloadCourseButton;