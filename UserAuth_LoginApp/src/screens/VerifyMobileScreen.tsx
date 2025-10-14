import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VerifyMobileProp = NativeStackNavigationProp<RootStackParamList, 'VerifyMobile'>;
type VerifyMobileRouteProp = RouteProp<RootStackParamList, 'VerifyMobile'>;

export default function VerifyMobileScreen() {
  const navigation = useNavigation<VerifyMobileProp>();
  const route = useRoute<VerifyMobileRouteProp>();
  const { email, mobile, userId } = route.params;

  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyMobile = async () => {
    if (!otp.trim()) {
      return Alert.alert('Error', 'Please enter the OTP.');
    }
    setLoading(true);
    try {
      console.log('Sending verify OTP request:', { userId, otp });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/verifyotp', { userId, otp });
      console.log('Verify OTP response:', res.data);
      if (res.status === 200) {
        Alert.alert('Success', res.data.message || 'Mobile number verified successfully!');
        if (res.data.status === 'Active') {
          navigation.navigate('Home');
        } else {
          navigation.navigate('VerificationOptions', { email, mobile, userId });
        }
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.request,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Mobile verification failed. Please check the OTP and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      console.log('Sending resend OTP request:', { mobile });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', { mobile });
      setResendCooldown(60);
      Alert.alert('Success', 'OTP resent to your mobile.');
    } catch (error: any) {
      console.error('Resend OTP Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.request,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to resend OTP.'
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

      <Text style={styles.title}>Verify Mobile</Text>
      <Text style={styles.subtitle}>Mobile: {mobile}</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your mobile:</Text>

      <TextInput
        placeholder="OTP"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyMobile}
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
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
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