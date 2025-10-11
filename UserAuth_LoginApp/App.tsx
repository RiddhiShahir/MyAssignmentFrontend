// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import VerifyMobileScreen from './src/screens/VerifyMobileScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import VerificationOptionsScreen from './src/screens/VerificationOptions';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Verification: { email: string; mobile: string };
  OtpVerification: { email: string; mobile: string };
  VerificationOptions: { email: string; mobile: string };
  VerifyEmail: { email: string };
  VerifyMobile: { mobile: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="VerificationOptions" component={VerificationOptionsScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
