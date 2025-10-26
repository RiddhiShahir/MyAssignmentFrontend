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
import LoginOptionsScreen from './src/screens/LoginOptionsScreen';
import LoginViaEmailScreen from './src/screens/LogiaViaEmailScreen';
import LoginViaMobileScreen from './src/screens/LoginViaMobileScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeProvider } from './src/screens/context/ThemesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Verification: { email: string; mobile: string; userId: string };
  OtpVerification: { email: string; mobile: string; userId: string };
  VerificationOptions: { email: string; mobile: string; userId: string };
  VerifyEmail: { email: string; mobile: string; userId: string };
  VerifyMobile: { email: string; mobile: string; userId: string };
  ForgotPassword: { email: string };
  ResetPassword: { email: string ; token:string};
  ChangePassword: undefined;
  Login: undefined;
  Dashboard: undefined;
  LoginOptions:undefined;
  LoginViaEmail:undefined;
  LoginViaMobile:undefined;
  Profile:  { refresh?: boolean, updated?: true} |undefined;
  EditProfile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
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
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
        <Stack.Screen name="LoginViaEmail" component={LoginViaEmailScreen} />
        <Stack.Screen name="LoginViaMobile" component={LoginViaMobileScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}