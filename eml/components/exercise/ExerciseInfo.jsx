// ExerciseInfo.js

import React from 'react';
import { View } from 'react-native';
import Text from '../general/Text';
import PropTypes from 'prop-types';

/*
Description:	Displays the course title and section title of the exercise the student is in.
Dependencies: 	The student must be in an exercise.
Props: 			courseTitle - The title of the course the student is in.
				sectionTitle - The title of the section the student is in.
*/

const ExerciseInfo = ({ courseTitle, sectionTitle }) => {
    return (
        <View className="items-center px-6 z-10 mt-20">
            <Text className="font-sans text-caption-body text-projectGray text-center">
                Course name: {courseTitle}
            </Text>
            <Text className="font-sans-bold text-lg text-projectBlack text-center">
                {sectionTitle}
            </Text>
        </View>
    );
};

ExerciseInfo.propTypes = {
    courseTitle: PropTypes.string.isRequired,
    sectionTitle: PropTypes.string.isRequired,
};

export default ExerciseInfo;
