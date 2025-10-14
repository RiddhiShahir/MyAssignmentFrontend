
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation types
type RootStackParamList = {
  ChangePassword: undefined;
  // Add other screens if needed
};

// Define navigation prop type for this screen
type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChangePassword'
>;

// Type your props
type Props = {
  navigation: ChangePasswordScreenNavigationProp;
};

export default function ChangePasswordScreen({ navigation }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt'); // stored at login
      await axios.post(
        'http://localhost:5017/api/auth/changepassword',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Password changed successfully!');
      navigation.goBack();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Request failed');
      } else {
        Alert.alert('Error', 'Unexpected error occurred');
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Current password"
        value={currentPassword}
        secureTextEntry
        onChangeText={setCurrentPassword}
      />
      <TextInput
        placeholder="New password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
}
