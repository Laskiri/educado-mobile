import React, { useContext, useEffect, useState } from 'react';
import { Image, Alert, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as StorageService from '../../../services/StorageService';
import PropTypes from 'prop-types';
import { checkCourseStoredLocally } from '../../../services/StorageService';
import trashCanOutline from '../../../assets/images/trash-can-outline.png';
import fileDownload from '../../../assets/images/file_download.png';
import { IconContext } from '../../../services/DownloadService';

const DownloadCourseButton = ({ course, disabled }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { iconState, updateIcon } = useContext(IconContext);

  useEffect(() => {
    let isMounted = true;

    const checkIfDownloaded = async () => {
      try {
        const result = await checkCourseStoredLocally(course.courseId);
        if (isMounted) {
          setIsDownloaded(result);
          // Set icon state only if it's not already correct
          if (iconState[course.courseId] !== (result ? trashCanOutline : fileDownload)) {
            updateIcon(course.courseId, result ? trashCanOutline : fileDownload);
          }
        }
      } catch (error) {
        console.error("Error checking if course is downloaded:", error);
      }
    };

    checkIfDownloaded();

    // Cleanup function to prevent setting state if component unmounts
    return () => {
      isMounted = false;
    };
  }, [course.courseId, iconState, updateIcon]);

  const downloadConfirmation = () =>
    Alert.alert('Baixar curso', 'Tem certeza de que deseja baixar este curso?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Baixar',
        onPress: async () => {
          try {
            const result = await StorageService.storeCourseLocally(course.courseId);
            if (result) {
              setIsDownloaded(true);
              updateIcon(course.courseId, trashCanOutline); // Update icon on successful download
            } else {
              alert('Não foi possível baixar o curso. Certifique-se de estar conectado à Internet.');
            }
          } catch (error) {
            console.error("Error downloading course:", error);
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
          try {
            const result = await StorageService.deleteLocallyStoredCourse(course.courseId);
            if (result) {
              setIsDownloaded(false);
              updateIcon(course.courseId, fileDownload); // Update icon on successful removal
            } else {
              alert('Algo deu errado. Não foi possível remover os dados armazenados do curso.');
            }
          } catch (error) {
            console.error("Error removing downloaded course:", error);
          }
        },
        style: 'destructive',
      },
    ]);

  const handlePress = () => {
    if (disabled) return;
    if (!isDownloaded) {
      downloadConfirmation();
    } else {
      removeDownloadConfirmation();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled}>
      <View style={styles.iconContainer}>
        <Image source={iconState[course.courseId] || fileDownload} style={styles.downloadIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
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
  course: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

export default DownloadCourseButton;
