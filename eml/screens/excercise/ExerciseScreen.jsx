// ExerciseScreen.js

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
import { completeComponent, handleLastComponent } from '../../services/utilityFunctions';
import { useNavigation } from '@react-navigation/native';

/*
Description: 	This screen is displayed when the student is doing an exercise.
				It displays the question and the answers, and the student can select one answer.
				When the student presses the confirm button, the answer is checked and the student is given feedback.
				When the student presses the continue button, the next component is displayed.
				The student can only continue if an answer is selected.
				The student is given 10 points when the answer is correct in the first try,
				otherwise the student gets 5 points when the answer is correct.
				The student gets 0 points when the answer is incorrect or they have completed the exercise before.
Dependencies: 	CompSwipeScreen, the screen which contains all the components in the section
Props:			- exerciseObject: The exercise object, which contains the question and the answers
				- sectionObject: The section object, which contains the section title
				- courseObject: The course object, which contains the course title
				- onContinue: A function that is called when the student presses the continue button,
				when the exercise is completed and it is the last component in the section, the student is taken to the section complete screen
*/

const ExerciseScreen = ({ componentList, exerciseObject, sectionObject, courseObject, onContinue }) => {
    const tailwindConfig = require('../../tailwind.config.js');
    const projectColors = tailwindConfig.theme.colors;
    const navigation = useNavigation();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [buttonText, setButtonText] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [points, setPoints] = useState(10);
    const [attempts, setAttempts] = useState(0);

    const handleReviewAnswer = async (isAnswerCorrect, answerIndex) => {
        setSelectedAnswer(answerIndex);
        if (buttonText === null) {
            setButtonText('Continuar');
            setShowFeedback(true);
            if (isAnswerCorrect) {
                setIsCorrectAnswer(true);
                setPoints(attempts === 0 ? 10 : 5);
                setIsPopUpVisible(true);
                try {
                    await completeComponent(exerciseObject, courseObject.courseId, true);
                } catch (error) {
                    console.error('Error completing the exercise:', error);
                }
            } else {
                setIsCorrectAnswer(false);
                setAttempts(prevAttempts => prevAttempts + 1);
            }
        }
        if (buttonText === 'Continuar') {
            setIsPopUpVisible(false);

            const currentLastComponent = componentList[componentList.length - 1];
            const isLastComponent = currentLastComponent.component._id === exerciseObject._id;

            if (isAnswerCorrect && isLastComponent) {
                try {
                    await handleLastComponent(exerciseObject, courseObject, navigation);
                } catch (error) {
                    console.error('Error handling last component:', error);
                }
            } else {
                onContinue(isAnswerCorrect);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <View className="flex-1 items-center">
                {/* Exercise Information */}
                <View className="text-center">
                    <ExerciseInfo courseTitle={courseObject.title} sectionTitle={sectionObject.title} />
                </View>

                {/* Question and Answers */}
                <View className="flex-1 w-full px-6">
                    {/* Question Text */}
                    <View className="mb-4">
                        <Text testID='exerciseQuestion' className='text-center text-lg font-sans-bold text-projectBlack'>
                            {exerciseObject.question}
                        </Text>
                    </View>

                    {/* Answers ScrollView with Fixed Height */}
                    <ScrollView className="py-2 h-60 mb-10">
                        {exerciseObject.answers.map((answer, index) => (
                            <View key={index} className="flex-row items-start pb-6">
                                {/* Radio Button */}
                                <RadioButton.Android
                                    disabled={buttonText === 'Continuar'}
                                    value={index}
                                    status={selectedAnswer === index ? 'checked' : 'unchecked'}
                                    onPress={() => handleReviewAnswer(answer.correct, index)}
                                    color={projectColors.primary_custom}
                                    uncheckedColor={projectColors.primary_custom}
                                />

                                {/* Answer Text and Feedback */}
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        disabled={buttonText === 'Continuar'}
                                        onPress={() => handleReviewAnswer(answer.correct, index)}
                                        className="flex-1"
                                    >
                                        <Text className="pt-2 pb-1 font-montserrat text-body text-projectBlack">
                                            {answer.text}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Feedback */}
                                    {showFeedback && selectedAnswer === index && (
                                        <View className={`flex-row items-center pb-2 w-fit rounded-medium ${answer.correct ? 'bg-projectGreen' : 'bg-projectRed'}`}>
                                            <View className="pl-2 pt-1">
                                                <Icon
                                                    size={10}
                                                    name={answer.correct ? 'check' : 'close'}
                                                    type='material'
                                                    color={answer.correct ? projectColors.success : projectColors.error}
                                                />
                                            </View>
                                            <Text className={`pl-1 pt-2 pr-2 text-caption-medium ${answer.correct ? 'text-success' : 'text-error'}`}>
                                                {answer.feedback}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Continue Button */}
            <View className="w-full px-6 mb-8">
                <TouchableOpacity
                    style={{ opacity: selectedAnswer === null ? 0.6 : 1 }}
                    className="bg-primary_custom px-10 py-4 rounded-medium flex-row items-center justify-center"
                    onPress={() => {
                        if (selectedAnswer !== null) {
                            handleReviewAnswer(exerciseObject.answers[selectedAnswer]?.correct, selectedAnswer);
                        }
                    }}
                >
                    <View className='flex-row items-center'>
                        <Text className="text-center font-sans-bold text-body text-projectWhite">
                            {buttonText}
                        </Text>
                        <Icon
                            name="chevron-right"
                            type="material"
                            size={24}
                            color="white"
                            style={{ marginLeft: 8 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* PopUp for Feedback */}
            {isPopUpVisible && (
                <PopUp pointAmount={points} isCorrectAnswer={isCorrectAnswer} />
            )}

            <StatusBar style='auto' />
        </SafeAreaView>
    );
};

ExerciseScreen.propTypes = {
    exerciseObject: PropTypes.object.isRequired,
    sectionObject: PropTypes.object.isRequired,
    courseObject: PropTypes.object.isRequired,
    onContinue: PropTypes.func.isRequired,
    componentList: PropTypes.array.isRequired,
};

export default ExerciseScreen;
