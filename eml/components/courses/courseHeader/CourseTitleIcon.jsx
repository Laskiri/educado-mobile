import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Text } from '@ui-kitten/components'
import PropTypes from 'prop-types'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/dev'

export default function CourseTitleIcon({ title, courseIcon }) {
  CourseTitleIcon.propTypes = {
    title: PropTypes.string.isRequired,
    courseIcon: PropTypes.string.isRequired
  }

  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular
  })

  console.log(courseIcon)

  return (
    <View style={styles.container}>
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{ fontSize: 30, fontFamily: 'VarelaRound_400Regular', color: 'rgb(75,85,99)' }}
        >
          {title}
        </Text>
      </View>
      <View style={{ padding: '5%' }}>
        {courseIcon !== null ?
          <Image source={{ uri: courseIcon }}
            style={{ width: 50, height: 50 }}
            className="rounded-xl"
          ></Image>
          : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '75%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
