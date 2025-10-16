
// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// // Define navigation types
// type RootStackParamList = {
//   ChangePassword: undefined;
//   // Add other screens if needed
// };

// // Define navigation prop type for this screen
// type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'ChangePassword'
// >;

// // Type your props
// type Props = {
//   navigation: ChangePasswordScreenNavigationProp;
// };

// export default function ChangePasswordScreen({ navigation }: Props) {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleChangePassword = async () => {
//     try {
//       const token = await AsyncStorage.getItem('jwt'); // stored at login
//       await axios.post(
//         'http://localhost:5017/api/auth/changepassword',
//         { currentPassword, newPassword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Alert.alert('Success', 'Password changed successfully!');
//       navigation.goBack();
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         Alert.alert('Error', error.response?.data?.message || 'Request failed');
//       } else {
//         Alert.alert('Error', 'Unexpected error occurred');
//       }
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <TextInput
//         placeholder="Current password"
//         value={currentPassword}
//         secureTextEntry
//         onChangeText={setCurrentPassword}
//       />
//       <TextInput
//         placeholder="New password"
//         value={newPassword}
//         secureTextEntry
//         onChangeText={setNewPassword}
//       />
//       <Button title="Change Password" onPress={handleChangePassword} />
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return Alert.alert('Error', 'Missing token. Please log in again.');

      const response = await axios.post(
        'http://10.0.2.2:5017/api/auth/changepassword',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', response.data.message);
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.backText}>← Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b', padding: 20, justifyContent: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#5bc0be',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: 'white', fontWeight: '600' },
  backText: { color: '#fff', textAlign: 'center', marginTop: 10 },
});
