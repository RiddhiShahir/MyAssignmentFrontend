import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export default function OtpVerificationScreen({ route, navigation}: Props) {
  const { email, mobile } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.18:5017/api/auth/verify-otp', {
        email,
        mobile,
        otp,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Your account has been verified successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error?.response?.data?.message || 'Invalid OTP or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post('http://192.168.1.18:5017/api/auth/resend-otp', { email, mobile });
      if (res.status === 200) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email and mobile.');
      }
    } catch {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
  <Text style={styles.backText}>← Back</Text>
</TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.header}>OTP Verification</Text>
        <Text style={styles.info}>
          Enter the OTP sent to your registered email <Text style={styles.highlight}>{email}</Text> and mobile number.
        </Text>

        <TextInput
          placeholder="Enter 6-digit OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
         onPress={() => navigation.navigate('OtpVerification', { email, mobile })}>
         <Text style={styles.buttonText}>Proceed to Verification</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b132b' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%', elevation: 5 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  info: { color: '#444', marginBottom: 15 },
  highlight: { fontWeight: 'bold', color: '#0b132b' },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#0b132b', paddingVertical: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  resendText: { color: '#5bc0be', textAlign: 'center', marginTop: 12 },
  backButton: { position: 'absolute', top: 50, left: 20 },
backText: { color: '#5bc0be', fontSize: 16 },

});
