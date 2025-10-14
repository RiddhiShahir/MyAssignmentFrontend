import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import axios from 'axios';

type VerificationScreenProp = NativeStackNavigationProp<RootStackParamList, 'Verification'>;
type VerificationScreenRouteProp = RouteProp<RootStackParamList, 'Verification'>;

export default function VerificationScreen() {
  const navigation = useNavigation<VerificationScreenProp>();
  const route = useRoute<VerificationScreenRouteProp>();
  const { email, mobile, userId } = route.params; // Include userId

  // Log params to debug
  console.log('VerificationScreen params:', { email, mobile, userId });

  const handleResendVerification = async () => {
    try {
      // Call resend endpoints for email and OTP
      await axios.post('http://10.0.2.2:5017/api/auth/requesttoken', { email });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', { mobile });
      Alert.alert('Success', 'Verification link and OTP have been resent successfully.');
    } catch (error: any) {
      console.error('Resend Verification Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to resend verification. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verification Required</Text>
      <Text style={styles.subtitle}>
        Your account has been created successfully. Please verify your email and mobile number.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleResendVerification}>
        <Text style={styles.buttonText}>Resend Verification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerificationOptions', { email, mobile, userId })}
      >
        <Text style={styles.buttonText}>Proceed to Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#0b132b' },
  title: { color: 'white', fontSize: 22, fontWeight: '600', marginBottom: 10 },
  subtitle: { color: '#ccc', fontSize: 15, textAlign: 'center', marginBottom: 25 },
  button: { backgroundColor: '#5bc0be', borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', color: 'white', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: 'white', fontSize: 16 },
});