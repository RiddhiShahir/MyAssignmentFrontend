import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; 

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:5017/api/auth/forgotpassword', { email });
      Alert.alert('Success', 'Password reset link/token sent to your email.');
      navigation.navigate('ResetPassword', { email });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Reset Link" onPress={handleForgotPassword} />
    </View>
  );
}
