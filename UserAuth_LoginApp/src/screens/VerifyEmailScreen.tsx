import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from './context/ThemesContext';
import { useLanguage } from './context/LanguageContext';

type VerifyEmailProp = NativeStackNavigationProp<RootStackParamList, 'VerifyEmail'>;
type VerifyEmailRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<VerifyEmailProp>();
  const route = useRoute<VerifyEmailRouteProp>();
  const { email, mobile, userId } = route.params;

  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async () => {
    if (!token.trim()) {
      return Alert.alert(t('verificationTokenRequired'));
    }
    setLoading(true);
    try {
      console.log('Sending verify email request:', { userId, token });
      const res = await axios.post('http://10.0.2.2:5017/api/auth/verifyemail', { userId, token });
      console.log('Verify email response:', res.data);
      if (res.status === 200) {
        Alert.alert(t('success'), res.data.message || t('emailSuccess'));
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
        t('error'),
        error.response?.data?.error || t('emailError')
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
        t('error'),
        error.response?.data?.error || t('emailResendError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('verifyEmail')}</Text>
      <Text style={[styles.subtitle, {color:theme.text}]}>{t('email')}: {email}</Text>
      <Text style={[styles.subtitle, {color:theme.text}]}>{t('emailVerificationTokenRequired')}</Text>

      <TextInput
        placeholder={t('verificationToken')}
        style={[styles.input,{color: theme.text}]}
        value={token}
        onChangeText={setToken}
      />

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleVerifyEmail}
        disabled={loading}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{loading ? t('verifying') : t('verifyEmailNow')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleResend}
        disabled={loading || resendCooldown > 0}>
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : t('resendVerificationLink')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  title: { fontSize: 22, marginBottom: 10 },
  subtitle: { marginBottom: 10, textAlign: 'center' },
  input: { borderRadius: 8, marginBottom: 10, padding: 12, width: '80%' },
  button: { borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { fontSize: 16 },
});