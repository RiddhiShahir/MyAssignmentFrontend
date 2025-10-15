import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ForgotPasswordProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordProp>();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email.');
    setLoading(true);
    try {
      const res = await axios.post('http://10.0.2.2:5017/api/auth/forgotpassword', { email });
      Alert.alert('Success', res.data.message || 'Verification email sent!');
      setToken(res.data.token); // backend should return the token (optional)
      setIsVerified(true);
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </Text>
      </TouchableOpacity>

      {isVerified && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#3aafa9' }]}
          onPress={() => navigation.navigate('ResetPassword', { email, token })}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b132b',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#5bc0be',
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});
