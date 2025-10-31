import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';
import PasswordInput from '.././components/PasswordInput';

type LoginEmailProp = NativeStackNavigationProp<RootStackParamList, 'LoginViaEmail'>;

export default function LoginViaEmailScreen() {
  const navigation = useNavigation<LoginEmailProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert(t('error'), t('loginCredRequired'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert(t('error'), t('emailInvalid'));
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

      Alert.alert(t('success'), message || t('LoginSuccess'));
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(t('error'), error.response?.data?.error || t('LoginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LoginOptions')}>
        <Text style={[styles.backText,{color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('LoginViaEmail')}</Text>

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder= {t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> */}

      <PasswordInput
      placeholder={t('password')}
      value={password}
      onChangeText={setPassword}
      style={[styles.input, { backgroundColor: theme.input }]}
     />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ForgotPassword', { email })}>
        <Text style={styles.linkText}>{t('ForgotPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleLogin}
        disabled={loading}>
        <Text style={styles.buttonText}>{loading ? t('loggingIn') : t('login')}</Text>
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
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginVertical: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
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
    fontSize: 16,
  },
});
