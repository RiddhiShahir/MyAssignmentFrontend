import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VerifyEmailProp = NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
type VerifyEmailRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<VerifyEmailProp>();
  const route = useRoute<VerifyEmailRouteProp>();
  const { email, mobile, userId } = route.params;

  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async () => {
    if (!token.trim()) {
      return Alert.alert('Error', 'Please enter the verification token.');
    }
    setLoading(true);
    try {
      console.log('Sending verify email request:', { userId, token });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/verifyemail', { userId, token });
      console.log('Verify email response:', res.data);
      if (res.status === 200) {
        Alert.alert('Success', res.data.message || 'Email verified successfully!');
        if (res.data.status === 'Active') {
          navigation.navigate('Home');
        } else {
          navigation.navigate('VerificationOptions', { email, mobile, userId });
        }
      }
    } catch (error: any) {
      console.error('Verify Email Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.request,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Email verification failed. Please check the token and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      console.log('Sending resend email request:', { email });
      await axios.post('http://10.0.2.2:5017/api/auth/requesttoken', { email });
      setResendCooldown(60);
      Alert.alert('Success', 'Verification link resent to your email.');
    } catch (error: any) {
      console.error('Resend Email Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.request,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to resend verification link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>Email: {email}</Text>
      <Text style={styles.subtitle}>Enter the verification token from your email:</Text>

      <TextInput
        placeholder="Verification Token"
        style={styles.input}
        value={token}
        onChangeText={setToken}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify Now'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleResend}
        disabled={loading || resendCooldown > 0}
      >
        <Text style={styles.buttonText}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Link'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#0b132b' },
  title: { color: 'white', fontSize: 22, marginBottom: 10 },
  subtitle: { color: '#ccc', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: 'white', borderRadius: 8, marginBottom: 10, padding: 12, width: '80%' },
  button: { backgroundColor: '#5bc0be', borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', color: 'white', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: 'white', fontSize: 16 },
});