import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import Text from '../../components/general/Text';
import { RadioButton } from 'react-native-paper';
import ExerciseInfo from '../../components/exercise/ExerciseInfo';
import { Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import PopUp from '../../components/gamification/PopUp';
import { StatusBar } from 'expo-status-bar';
import PropTypes from 'prop-types';
import { handleLastComponent } from '../../services/utilityFunctions';
import { useNavigation } from '@react-navigation/native';
import { getLoginToken, getUserId, updateStudentInfo } from '../../services/StorageService';
import * as userApi from '../../api/userApi';

export default function ExerciseScreen({ componentList, exerciseObject, sectionObject, courseObject, onContinue }) {
    const tailwindConfig = require('../../tailwind.config.js');
    const projectColors = tailwindConfig.theme.colors;
    const navigation = useNavigation();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [buttonClassName] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [buttonText, setButtonText] = useState(null);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [points, setPoints] = useState(0);
    const [attempts, setAttempts] = useState(0);

    async function handleReviewAnswer(isAnswerCorrect, answerIndex) {
        setSelectedAnswer(answerIndex);
        if (buttonText === null) {
            setButtonText('Continuar');
            setShowFeedback(true);

            if (isAnswerCorrect) {
                setIsCorrectAnswer(true);
                setIsPopUpVisible(true);

                try {
                    const userId = await getUserId();
                    const token = await getLoginToken();

                    // Make sure we're sending exercise details correctly
                    const componentData = {
                        ...exerciseObject,
                        type: 'exercise',
                        compType: 'exercise',
                        isFirstAttempt: attempts === 0,
                        _id: exerciseObject._id || exerciseObject.compId
                    };

                    console.log('Sending exercise completion:', {
                        componentId: componentData._id,
                        type: componentData.type,
                        isFirstAttempt: componentData.isFirstAttempt,
                        parentSection: componentData.parentSection
                    });

                    const result = await userApi.completeComponent(
                        userId,
                        componentData,
                        true,
                        token
                    );

                    if (result) {
                        // Find the completed component in the response
                        const completedCourse = result.courses?.find(c =>
                            c.courseId === courseObject.courseId
                        );
                        const completedSection = completedCourse?.sections?.find(s =>
                            s.sectionId === exerciseObject.parentSection
                        );
                        const completedComponent = completedSection?.components?.find(c =>
                            c.compId === componentData._id
                        );

                        console.log('Completion result:', {
                            userPoints: result.points,
                            coursePoints: completedCourse?.totalPoints,
                            sectionPoints: completedSection?.totalPoints,
                            componentPoints: completedComponent?.pointsGiven
                        });

                        if (completedComponent?.pointsGiven) {
                            setPoints(completedComponent.pointsGiven);
                        }

                        await updateStudentInfo(result);
                    }
                } catch (error) {
                    console.error('Error completing exercise:', error);
                }
            } else {
                setIsCorrectAnswer(false);
                setAttempts(attempts + 1);
            }
        }

        if (buttonText === 'Continuar') {
            const currentLastComponent = componentList[componentList.length - 1];
            const isLastComponent = currentLastComponent.component._id === exerciseObject._id;

            if (isAnswerCorrect && isLastComponent) {
                try {
                    setIsPopUpVisible(false);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await handleLastComponent(exerciseObject, courseObject, navigation);
                } catch (error) {
                    console.error('Error in last component handling:', error);
                }
            } else {
                setIsPopUpVisible(false);
                onContinue(isAnswerCorrect);
            }
        }
    }

    return (
        <SafeAreaView className="h-full bg-secondary">
            <View className='items-center'>
                <Text testID='exerciseQuestion'
                    className='pt-20 pb-10 text-center text-body font-sans-bold text-projectBlack w-11/12'>
                    {exerciseObject.question}
                </Text>

                <View className={`${buttonClassName} items-center justify-center h-96 w-full`}>
                    <ScrollView className="py-2">
                        {exerciseObject.answers.map((answer, index) => (
                            <View
                                key={index}
                                className='flex-row w-96 pb-6 pl-2'
                            >
                                <View>
                                    <RadioButton.Android
                                        disabled={buttonText === 'Continuar'}
                                        value={index}
                                        status={
                                            selectedAnswer === index ? 'checked' : 'unchecked'
                                        }
                                        onPress={() => handleReviewAnswer(exerciseObject.answers[selectedAnswer]?.correct, index)}
                                        color={projectColors.primary_custom}
                                        uncheckedColor={projectColors.primary_custom}
                                    />
                                </View>

                                <View>
                                    <TouchableOpacity
                                        disabled={buttonText === 'Continuar'}
                                        value={index}
                                        status={
                                            selectedAnswer === index ? 'checked' : 'unchecked'
                                        }
                                        onPress={() => handleReviewAnswer(exerciseObject.answers[selectedAnswer]?.correct, index)}
                                    >
                                        <Text className='pt-2 pb-1 w-72 font-montserrat text-body text-projectBlack'>{answer.text}</Text>
                                    </TouchableOpacity>

                                    {showFeedback && selectedAnswer === index ? (
                                        <View className={`flex-row pb-2 w-fit rounded-medium ${answer.correct ? 'bg-projectGreen' : 'bg-projectRed'}`}>
                                            <View className='pl-2 pt-1'>
                                                <View className='pt-1.5'>
                                                    {answer.correct === true ? (
                                                        <Icon
                                                            size={10}
                                                            name='check'
                                                            type='material'
                                                            color={projectColors.success}
                                                        />
                                                    ) : (
                                                        <Icon
                                                            size={10}
                                                            name='close'
                                                            type='material'
                                                            color={projectColors.error}
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                            <Text className={`w-72 pl-1 pt-2 pr-2 text-caption-medium ${answer.correct ? 'text-success' : 'text-error'}`}>{answer.feedback}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View className='px-6 pt-10 w-screen'>
                    <TouchableOpacity
                        disabled={selectedAnswer === null}
                        className={`${selectedAnswer !== null ? 'opacity-100' : 'opacity-0'} bg-primary_custom px-10 py-4 rounded-medium`}
                        onPress={() => handleReviewAnswer(exerciseObject.answers[selectedAnswer]?.correct, 8)}
                    >
                        <Text className='text-center font-sans-bold text-body text-projectWhite'>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isPopUpVisible ? (
                <PopUp pointAmount={points} isCorrectAnswer={isCorrectAnswer} />
            ) : null}

            {<ExerciseInfo courseTitle={courseObject.title} sectionTitle={sectionObject.title} />}
            <StatusBar style='auto' />
        </SafeAreaView>
    );
}

ExerciseScreen.propTypes = {
    exerciseObject: PropTypes.object,
    sectionObject: PropTypes.object,
    courseObject: PropTypes.object,
    onContinue: PropTypes.func,
    componentList: PropTypes.array,
};