import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

type LoginMobileProp = NativeStackNavigationProp<RootStackParamList, 'LoginViaMobile'>;

export default function LoginViaMobileScreen() {
  const navigation = useNavigation<LoginMobileProp>();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
    }

    setLoading(true);
    try {
      console.log('Sending OTP request:', { mobile });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', { mobile });
      setResendCooldown(60);
      Alert.alert('Success', 'OTP sent to your mobile.');
    } catch (error: any) {
      console.error('OTP error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!mobile || !otp) {
      return Alert.alert('Error', 'Please enter both mobile number and OTP.');
    }

    setLoading(true);
    try {
      console.log('Logging in via mobile:', { mobile });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/login', {
        identifier: mobile,
        password: otp,
        loginMethod: 'mobile',
      });

      const { accessToken, refreshToken, userId, message } = res.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userId', userId.toString());

      Alert.alert('Success', message || 'Login successful!');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login via Mobile</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile (10 digits)"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: resendCooldown > 0 ? '#888' : '#5bc0be' }]}
        onPress={handleSendOtp}
        disabled={resendCooldown > 0 || loading}
      >
        <Text style={styles.buttonText}>
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
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
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginVertical: 8,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
});
