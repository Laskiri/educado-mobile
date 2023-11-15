import { View, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Text from '../../../components/general/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomProgressBar from "../../exercise/Progressbar";
import tailwindConfig from "../../../tailwind.config";
import { determineIcon, determineCategory } from '../../../services/utilityFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * CourseCard component displays a card for a course with its details
 * @param {Object} props - Component props
 * @param {Object} props.course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
export default function CourseCard({ course }) {
    const navigation = useNavigation();

const checkDownload = async () => {
    return !!(await AsyncStorage.getItem(course.courseId + await AsyncStorage.getItem('@userId')))
}; 

    return (
        checkDownload ? 
        <Pressable testID="courseCard"
            className="bg-projectWhite m-[3%] rounded-lg shadow-sm shadow-opacity-[0.3] elevation-[8] mx-[5%] p-[5%]"
            onPress={() => {
                navigation.navigate('Section', {
                    courseId: course.courseId,
                });
            }}
        >
            <View>
                <View className="flex-row items-start justify-between px-[1%] py-[1%]">
                    <MaterialCommunityIcons size={28}
                        name={course.image ? course.image : 'school'}> </MaterialCommunityIcons>
                    <Text className="text-[18px] text-black flex-1 self-center">
                        {course.title ? course.title : 'Título do curso'}
                    </Text>
                </View>
                <View className="h-[1] bg-disable m-[2%]" />
                <View className="flex-row flex-wrap items-center justify-start">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons size={18} name={determineIcon(course.category)} color={'gray'}></MaterialCommunityIcons>
                        <Text className="mx-[2.5%] my-[3%]">{determineCategory(course.category)}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons size={18} name="clock" color={'gray'}></MaterialCommunityIcons>
                        <Text className="mx-[2.5%] my-[3%]">{course.estimatedHours ? course.estimatedHours + ' hora(s)' : 'duração'}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    {/* TODO: Implement progress dynamically */}
                    <CustomProgressBar width={56} progress={50} height={1} />
                    <Pressable className="z-[1]"
                        onPress={() => {
                            navigation.navigate('Section', {
                                courseId: course.courseId,
                            });
                        }}
                    > 
                        <MaterialCommunityIcons size={28} name="play-circle" color={tailwindConfig.theme.colors.primary}></MaterialCommunityIcons>
                    </Pressable>
                </View>
            </View>
        </Pressable>
        :
        <View>
        <Pressable testID="courseCard"
            className="opacity-50 bg-projectWhite m-[3%] rounded-lg shadow-sm shadow-opacity-[0.3] elevation-[8] mx-[5%] p-[5%]"
            onPress={() => {
             console.log('not downloaded')
            }}
        >
            <View>
                <View className="flex-row items-start justify-between px-[1%] py-[1%]">
                    <MaterialCommunityIcons size={28}
                        name={course.image ? course.image : 'school'}> </MaterialCommunityIcons>
                    <Text className="text-[18px] text-black flex-1 self-center">
                        {course.title ? course.title : 'Título do curso'}
                    </Text>
                </View>
                <View className="h-[1] bg-disable m-[2%]" />
                <View className="flex-row flex-wrap items-center justify-start">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons size={18} name={determineIcon(course.category)} color={'gray'}></MaterialCommunityIcons>
                        <Text className="mx-[2.5%] my-[3%]">{determineCategory(course.category)}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons size={18} name="clock" color={'gray'}></MaterialCommunityIcons>
                        <Text className="mx-[2.5%] my-[3%]">{course.estimatedHours ? course.estimatedHours + ' hora(s)' : 'duração'}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    {/* TODO: Implement progress dynamically */}
                    <CustomProgressBar width={56} progress={50} height={1} />
                    <Pressable className="z-[1]"
                        onPress={() => {
                            navigation.navigate('Section', {
                                courseId: course.courseId,
                            });
                        }}
                    > 
                        <MaterialCommunityIcons size={28} name="play-circle" color={tailwindConfig.theme.colors.primary}></MaterialCommunityIcons>
                    </Pressable>
                </View>
            </View>
        </Pressable>
        </View>
    )

}