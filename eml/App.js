import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import LoginScreen from './screens/login/Login';
import RegisterScreen from './screens/register/Register';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseScreen from './screens/excercise/ExerciseScreen';
import { TailwindProvider } from 'tailwindcss-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SectionScreen from './screens/section/SectionScreen';
import { isFontsLoaded } from './constants/Fonts';
import LoadingScreen from './components/loading/Loading';
import WelcomeScreen from './screens/welcome/Welcome';
import CompleteSectionScreen from './screens/section/CompleteSection';
import NavBar from './components/navBar/NavBar';
import CompSwipeScreen from './screens/lectures/CompSwipeScreen';
import ErrorScreen from './screens/errors/ErrorScreen';
import CourseScreen from './screens/courses/CourseScreen';
import EditProfileScreen from './screens/profile/EditProfile';
import EditPasswordScreen from './screens/profile/EditPassword';
import CertificateScreen from './screens/certificate/CertificateScreen';
import CompleteCourseScreen from './screens/courses/CompleteCourse';
import CameraScreen from './screens/camera/CameraScreen';
import BaseScreen from './components/general/BaseScreen';
import SubscribedToCourseScreen from './screens/courses/SubscribedToCourseScreen';
import axios from 'axios'

// Debug configuration
if (__DEV__) {
  // Log request data
  axios.interceptors.request.use(
    (request) => {
      console.log('Starting Request:', request);
      return request;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Log response data
  axios.interceptors.response.use(
    (response) => {
      console.log('Response:', response);
      return response;
    },
    (error) => {
      console.error('Response Error:', error.response ? error.response : error);
      return Promise.reject(error);
    }
  );
  // Enable network debugging
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
  global.FormData = global.originalFormData || global.FormData;

  // Ignore common development warnings
  LogBox.ignoreLogs([
    'Require cycle:',
    'Non-serializable values were found in the navigation state',
  ]);

  // Network request logging with filtering
  global._fetch = fetch;
  global.fetch = function(uri, options, ...args) {
    return global._fetch(uri, options, ...args).then((response) => {
      // Filter out Expo logs and other development endpoints
      if (!uri.includes('/logs') &&
          !uri.includes('://localhost') &&
          !uri.includes('://127.0.0.1') &&
          !uri.endsWith('/symbolicate')) {
        console.log('Fetch Request:', {
          uri,
          method: options?.method || 'GET',
          headers: options?.headers,
          body: options?.body ? JSON.parse(options.body) : undefined
        });
      }
      return response;
    });
  };
}

const Stack = createNativeStackNavigator();

function WelcomeStack() {
  return (
    <Stack.Navigator initialRouteName={'Welcome'}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function LoginStack() {
  return (
    <Stack.Navigator initialRouteName={'Login'}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function CertificateStack() {
  return (
    <Stack.Navigator initialRouteName={'Certificate'}>
      <Stack.Screen
        name="Certificate"
        component={CertificateScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function CourseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Course"
        component={CourseScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CompleteSection"
        component={CompleteSectionScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Section"
        component={SectionScreen}
        initialParams={{ course_id: '' }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ErrorScreen"
        component={ErrorScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export function useWelcomeScreenLogic(loadingTime, onResult) {
  setTimeout(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('hasShownWelcome');
        let initialRoute = 'WelcomeStack';
        let isLoading = true;

        if (value === 'true') {
          initialRoute = 'LoginStack';
        } else {
          await AsyncStorage.setItem('hasShownWelcome', 'true');
        }

        isLoading = false;
        onResult(initialRoute, isLoading);

        if (__DEV__) {
          console.log('Welcome screen logic:', {
            hasShownWelcome: value,
            initialRoute,
            isLoading
          });
        }
      } catch (error) {
        console.error('Error retrieving or setting AsyncStorage data:', error);
        if (__DEV__) {
          console.log('AsyncStorage error details:', error);
        }
      }
    };

    fetchData();
  }, loadingTime);
}

export default function App() {
  const fontsLoaded = isFontsLoaded();
  const [initialRoute, setInitialRoute] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = React.useRef();

  // Debug error boundary
  useEffect(() => {
    if (__DEV__) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('You seem to update a component')) return;
        originalConsoleError.apply(console, args);
      };
    }
  }, []);

  const handleResult = (route, loading) => {
    if (__DEV__) {
      console.log('Navigation state changed:', { route, loading });
    }
    setInitialRoute(route);
    setIsLoading(loading);
  };

  useWelcomeScreenLogic(3000, handleResult);

  if (!fontsLoaded) {
    if (__DEV__) console.log('Fonts not loaded yet');
    return null;
  }

  if (isLoading && fontsLoaded) {
    if (__DEV__) console.log('Showing loading screen');
    return <LoadingScreen />;
  }

  return (
    <TailwindProvider>
      <BaseScreen>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={(state) => {
              if (__DEV__) console.log('Navigation State:', state);
            }}
          >
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen
                name="WelcomeStack"
                component={WelcomeStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginStack"
                component={LoginStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HomeStack"
                component={NavBar}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={'CourseStack'}
                component={CourseStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={'Section'}
                component={SectionScreen}
                initialParams={{ course_id: '' }}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={'CompleteSection'}
                component={CompleteSectionScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditPassword"
                component={EditPasswordScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Exercise"
                component={ExerciseScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Components"
                component={CompSwipeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CertificateStack"
                component={CertificateStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CompleteCourse"
                component={CompleteCourseScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Camera"
                component={CameraScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Subscribed"
                component={SubscribedToCourseScreen}
                initialParams={{course_id: ''}}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </BaseScreen>
    </TailwindProvider>
  );
}