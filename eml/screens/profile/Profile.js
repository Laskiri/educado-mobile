import React, { useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import ProfileName from '../../components/profile/profileName'
import LogOutButton from '../../components/profile/LogOutButton'
import SettingsButton from '../../components/profile/settingsButton.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BgLinearGradient } from "../../constants/BgLinearGradient";

const USER_INFO = '@userInfo'

export default function ProfileComponent() {
  const [id, setId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  // this file is modified only for the review on Thursday the 26/10/23

  const getProfile = async () => {
    try {
      const fetchedProfile = JSON.parse(await AsyncStorage.getItem(USER_INFO))

      if (fetchedProfile !== null) {
        setId(fetchedProfile.id)
        setFirstName("") // refer to fetched profile when backend is ready
        setLastName("") // refer to fetched profile when backend is ready
        setEmail(fetchedProfile.email)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])
  
  return (
    <BgLinearGradient>
      <SafeAreaView>
        <ScrollView>
          <View className="flex-1 flex-col justify-center h-screen">
            <ProfileName Name={`${firstName} ${lastName}`}></ProfileName>
            <SettingsButton></SettingsButton>
            <LogOutButton testID='logoutBtn'></LogOutButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BgLinearGradient>
  )
}