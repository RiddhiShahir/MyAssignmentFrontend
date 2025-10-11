import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import axios from 'axios';

type VerificationScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Verification'
>;

export default function VerificationScreen() {
  const navigation = useNavigation<VerificationScreenProp>();
  const route = useRoute();
  const { email, mobile } = route.params as { email: string; mobile: string };

  const handleResendVerification = async () => {
    try {
      // You can call a resend endpoint here if you have one
      Alert.alert('Resent', 'Verification link or OTP has been resent successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verification Required</Text>
      <Text style={styles.subtitle}>
        Your account has been created successfully. Please verify your email or mobile number.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleResendVerification}>
        <Text style={styles.buttonText}>Resend Verification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerificationOptions', { email, mobile })}
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
