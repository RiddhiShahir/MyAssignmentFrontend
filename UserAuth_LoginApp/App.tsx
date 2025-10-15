import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import VerifyMobileScreen from './src/screens/VerifyMobileScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import VerificationOptionsScreen from './src/screens/VerificationOptionsScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen'; 
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Verification: { email: string; mobile: string; userId: string };
  OtpVerification: { email: string; mobile: string; userId: string };
  VerificationOptions: { email: string; mobile: string; userId: string };
  VerifyEmail: { email: string; mobile: string; userId: string };
  VerifyMobile: { email: string; mobile: string; userId: string };
  ForgotPassword: { email: string };
  ResetPassword: { email: string };
  ChangePassword: undefined;
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="VerificationOptions" component={VerificationOptionsScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}