import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ResetPassword: { email: string };
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5017/api/auth/resetpassword', {
        email,
        token,
        newPassword,
      });
      Alert.alert('Success', 'Password reset successful!');
      navigation.navigate('Login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to reset password.');
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Enter token" value={token} onChangeText={setToken} />
      <TextInput
        placeholder="Enter new password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
}
