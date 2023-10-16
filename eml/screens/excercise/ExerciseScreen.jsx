import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image, TouchableHighlight, Pressable, TouchableOpacity, Dimensions } from "react-native";
import LeaveButton from "../../components/exercise/LeaveButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as StorageService from "../../services/StorageService";
import CustomProgressBar from "../../components/exercise/Progressbar";
import dummyExerciseData from "./dummyExerciseData.json";
import { Button, RadioButton } from "react-native-paper";
import ExerciseInfo from "../../components/exercise/ExerciseInfo";
import { Icon } from '@rneui/themed';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const ScreenWidth = Dimensions.get('window').width;
  const tailwindConfig = require('../../tailwind.config.js');
  const projectColors = tailwindConfig.theme.colors;

  const [hasData, setHasData] = useState(false);
  const [signal, setSignal] = useState([]);
  const [exerciseData, setExerciseData] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null); // State to store the selected answer
  const [buttonClassName, setButtonClassName] = useState(""); // Used to change color of a view
  const [showFeedback, setShowFeedback] = useState(false); // Used to render feedback


  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  var reviewAnswer;

  // Update this function to look like handleAnswerSelect, looks better
  function handleReviewAnswer() {
    if (dummyExerciseData.answers[selectedAnswer - 1].isCorrect) {
      setButtonClassName("bg-projectGreen");
      reviewAnswer = true;
    } else {
      setButtonClassName("bg-projectRed");
      reviewAnswer = false;
    }
    setShowFeedback(true);
    console.log(reviewAnswer);
  }

  /*async function getExercise() {
    const exercise = await StorageService.getNextExercise(sectionId);

    if (exercise !== null) {
      console.log(exercise);

      if (exercise === true) {
        navigation.navigate("SectionComplete", {
          courseId: courseId,
          sectionId: sectionId,
        });
      } else {
        setExerciseData(exercise);
      }
    } else {
      navigation.navigate("ErrorScreen");
    }
  }*/

  async function getExercise() {
    // Instead of calling StorageService.getNextExercise, use the dummy data
    const exercise = dummyExerciseData;

    if (exercise !== null) {
      /* const courseId = exercise.courseId || "defaultCourseId";
      const sectionId = exercise.sectionId || "defaultSectionId";*/

      if (exercise === true) {
        /* navigation.navigate("SectionComplete", {
          courseId: courseId,
          sectionId: sectionId,
        });*/
      } else {
        setExerciseData(exercise);
      }
    } else {
      navigation.navigate("ErrorScreen");
    }
  
  }

  /*async function isSectionComplete(courseId, sectionId) {
    const course = await StorageService.getCourseById(courseId);
    const sections = course.sections;

    for (let i = 0; i < sections.length; i++) {
      console.log("Section is complete: ", sections[i].isComplete);
      if (sections[i].id === sectionId) {
        return sections[i].isComplete;
      }
    }
  }*/

  useEffect(() => {
    getExercise().then(() => {
      setHasData(true);
    });
  }, [route.params]);

  return (
    <View className="bg-secondary flex-1 justify-between">
      <SafeAreaView className= "justify-between" >
        <View className = "flex-row items-center justify-around">
          <View>
              <LeaveButton
                navigationPlace={"Course"}
                courseId={dummyExerciseData.courseId}
              ></LeaveButton>
          </View>
          <CustomProgressBar progress={50} width={65} height={1.2}></CustomProgressBar>
        </View>

        {dummyExerciseData === undefined ? (
          // No Data
          <Text> Sem dados</Text>
        ) : (
          <View className="items-center">
            <Text className="pt-6 pb-10 text-center text-body font-montserrat-bold text-projectBlack w-11/12">
              {dummyExerciseData.question}
            </Text>
            <View className={`${buttonClassName} items-center justify-center h-96 w-full`}>
              <ScrollView>
                {/* Map through the answers and render each one */}
                {dummyExerciseData.answers.map((answer) => (
                  <View
                    key={answer.id}
                    className="flex-row w-96 pb-6 pl-2"
                  >
                    <View>
                      <RadioButton.Android
                        value={answer.id}
                        status={
                          selectedAnswer === answer.id ? "checked" : "unchecked"
                        }
                        onPress={() => handleAnswerSelect(answer.id)}
                        color= "#5ECCE9"
                        uncheckedColor="#5ECCE9"
                      />
                    </View>
                    <View>
                      <Pressable onPress={() => handleAnswerSelect(answer.id)}>
                        <Text className="pt-2 pb-1 w-72 font-montserrat text-body text-projectBlack">{answer.text}</Text>
                      </Pressable>
                      {showFeedback ? (
                      <View className={`flex-row pb-2 w-fit rounded-medium ${answer.isCorrect ? 'bg-projectGreen' : 'bg-projectRed'}`}>
                        <View className="pl-2 pt-1">
                          <View className="pt-1.5">
                            {answer.isCorrect === true ? ( 
                              <Icon
                              size={10}
                              name="check"
                              type="material"
                              color={projectColors.success}
                              />
                            ) : (
                              <Icon
                              size={10}
                              name="close"
                              type="material"
                              color={projectColors.error}
                              />
                            )}  
                           </View>                        
                        </View>
                        <Text className={`w-72 pl-1 pt-2 pr-2 font-montserrat text-caption-medium ${answer.isCorrect ? 'text-success' : 'text-error'}`}>{answer.feedback}</Text>
                      </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View className="px-6 pt-8 w-screen">
              <TouchableOpacity 
                className={`${selectedAnswer !== null ? 'opacity-100' : 'opacity-30'} bg-primary px-10 py-4 rounded-medium`}
                onPress={() => handleReviewAnswer()}
              >
                <Text className="text-center font-montserrat-bold text-body text-projectWhite">Confirmar resposta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Old exercise buttons
        <View style={{ flex: 3 }}>
          {exerciseData === undefined ? (
            //No data
            <Text> Sem dados</Text>
          ) : (
            <ExerciseButtons
              answers={exerciseData.answers}
              exerciseId={exerciseData.id}
              courseId={exerciseData.courseId}
              sectionId={exerciseData.sectionId}
              setSignal={setSignal}
              hasData={hasData}
            ></ExerciseButtons>
          )}
        </View>
        */}
        
      <ExerciseInfo courseId={dummyExerciseData.courseId} sectionId={dummyExerciseData.sectionId}/>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}
