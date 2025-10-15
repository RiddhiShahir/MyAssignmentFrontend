// src/screens/LoginViaEmailScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

type LoginEmailProp = NativeStackNavigationProp<RootStackParamList, 'LoginViaEmail'>;

export default function LoginViaEmailScreen() {
  const navigation = useNavigation<LoginEmailProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Error', 'Please enter a valid email address.');
    }

    setLoading(true);
    try {
      console.log('Sending email login request:', { email });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/login', {
        identifier: email,
        password: password,
        loginMethod: 'email',
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login via Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ForgotPassword', { email })}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
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
    marginTop: 20,
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
