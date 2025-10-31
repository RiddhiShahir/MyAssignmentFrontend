import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';

type LoginMobileProp = NativeStackNavigationProp<RootStackParamList, 'LoginViaMobile'>;

export default function LoginViaMobileScreen() {
  const navigation = useNavigation<LoginMobileProp>();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleSendOtp = async () => {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return Alert.alert(t('error'), t('invalidMobileNumber'));
    }

    setLoading(true);
    try {
      console.log('Sending OTP request:', { mobile });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', { mobile });
      setResendCooldown(60);
      Alert.alert(t('success'), t('otpSent'));
    } catch (error: any) {
      console.error('OTP error:', error);
      Alert.alert(t('error'), error.response?.data?.error || t('failedOTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!mobile || !otp) {
      return Alert.alert(t('error'), t('CredRequired'));
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

      Alert.alert(t('success'), message || t('LoginSuccess'));
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(t('error'), error.response?.data?.error || t('LoginFailed'));
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
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('LoginViaMobile')}</Text>

      <TextInput
        style={[styles.input,{backgroundColor: theme.input}]}
        placeholder= {t('MobileNumber')}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={[styles.input,{backgroundColor: theme.input}]}
        placeholder= {t('OTP')}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: resendCooldown > 0 ? '#888' : theme.primary }]}
        onPress={handleSendOtp}
        disabled={resendCooldown > 0 || loading}>
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {resendCooldown > 0 ? `${resendCooldown}s ${t('resendCooldown')}` : t('SendOTP')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleLogin}
        disabled={loading}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{loading ? t('loggingIn') : t('login')}</Text>
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
    marginVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
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
