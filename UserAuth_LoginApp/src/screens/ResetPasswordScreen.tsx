import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';

type ResetPasswordProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<ResetPasswordProp>();
  const route = useRoute<any>();
  const { email: routeEmail, token: routeToken } = route.params;

  const [email, setEmail] = useState(routeEmail || '');
  const [token, setToken] = useState(routeToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const handleResetPassword = async () => {
    if (!email || !token || !newPassword) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    setLoading(true);
    try {
      const res = await axios.post('http://10.0.2.2:5017/api/auth/resetpassword', {
        email,
        token,
        newPassword,
      });
      Alert.alert('Success', res.data.message || 'Password reset successful!');
      navigation.navigate('LoginViaEmail');
    } catch (error: any) {
      console.error('Reset password error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <Text style={[styles.title,{color:theme.text}]}>Reset Password</Text>

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder="Enter Token"
        value={token}
        onChangeText={setToken}
      />

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleResetPassword}
        disabled={loading}>
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {loading ? 'Resetting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
