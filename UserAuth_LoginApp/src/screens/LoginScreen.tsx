import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

type LoginProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginProp>();
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    loginMethod: 'email', // Default to email
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!form.identifier || !form.password) {
      return Alert.alert('Error', 'Please enter both identifier and password/OTP.');
    }

    // Basic validation
    if (form.loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.identifier)) {
        return Alert.alert('Error', 'Please enter a valid email address.');
      }
    } else if (form.loginMethod === 'mobile') {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(form.identifier)) {
        return Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      }
    }

    setLoading(true);
    try {
      console.log('Sending login request:', {
        identifier: form.identifier,
        password: '****',
        loginMethod: form.loginMethod,
      });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/login', {
        identifier: form.identifier,
        password: form.password,
        loginMethod: form.loginMethod,
      });
      console.log('Login response:', res.data);

      const { accessToken, refreshToken, userId, message } = res.data;

      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userId', userId.toString());

      Alert.alert('Success', message || 'Login successful!');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend for mobile login
  const handleResendOtp = async () => {
    if (form.loginMethod !== 'mobile') {
      return Alert.alert('Error', 'OTP resend is only available for mobile login.');
    }
    if (!form.identifier) {
      return Alert.alert('Error', 'Please enter your mobile number.');
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(form.identifier)) {
      return Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
    }

    setLoading(true);
    try {
      console.log('Sending resend OTP request:', { mobile: form.identifier });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', {
        mobile: form.identifier,
      });
      setResendCooldown(60);
      Alert.alert('Success', 'OTP resent to your mobile.');
    } catch (error: any) {
      console.error('Resend OTP error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to resend OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle resend cooldown
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login</Text>

      <Picker
        selectedValue={form.loginMethod}
        style={styles.picker}
        onValueChange={(value) => handleInputChange('loginMethod', value)}
      >
        <Picker.Item label="Login with Email" value="email" />
        <Picker.Item label="Login with Mobile" value="mobile" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder={form.loginMethod === 'email' ? 'Email' : 'Mobile (10 digits)'}
        value={form.identifier}
        onChangeText={(text) => handleInputChange('identifier', text)}
        keyboardType={form.loginMethod === 'email' ? 'email-address' : 'numeric'}
        autoCapitalize={form.loginMethod === 'email' ? 'none' : 'characters'}
        maxLength={form.loginMethod === 'mobile' ? 10 : undefined}
      />

      <TextInput
        style={styles.input}
        placeholder={form.loginMethod === 'email' ? 'Password' : 'OTP'}
        value={form.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry={form.loginMethod === 'email'}
        keyboardType={form.loginMethod === 'mobile' ? 'numeric' : 'default'}
        maxLength={form.loginMethod === 'mobile' ? 6 : undefined}
      />

      {form.loginMethod === 'mobile' && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleResendOtp}
          disabled={loading || resendCooldown > 0}
        >
          <Text style={styles.buttonText}>
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ForgotPassword', { email: form.identifier })}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
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
    backgroundColor: '#0b132b',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    marginVertical: 8,
    color: '#000',
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
  linkButton: {
    marginVertical: 10,
  },
  linkText: {
    color: '#5bc0be',
    fontSize: 16,
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