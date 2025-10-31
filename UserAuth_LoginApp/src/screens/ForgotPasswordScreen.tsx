import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';

type ForgotPasswordProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordProp>();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleVerify = async () => {
    if (!email) return Alert.alert(t('error'), t('pleaseEnterYourEmail'));
    setLoading(true);
    try {
      const res = await axios.post('http://10.0.2.2:5017/api/auth/forgotpassword', { email });
      Alert.alert(t('success'), res.data.message || t('verificationEmailSent'));
      setToken(res.data.token); // backend should return the token (optional)
      setIsVerified(true);
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data || error.message);
      Alert.alert(t('error'), error.response?.data?.error || t('failedToSendResetToken'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <Text style={[styles.title,{color:theme.text}]}>{t('ForgotPassword')}</Text>

       {/* Back Button */}
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LoginViaEmail')}>
           <Text style={[styles.backText,{color:theme.text}]}> {t('back')}</Text>
       </TouchableOpacity>

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder= {t('enterEmail')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"/>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleVerify}
        disabled={loading}>
        <Text style={[styles.buttonText,{color:theme.text}]}>
        {loading ? t('verifying') : t('verifyEmail')}
        </Text>
      </TouchableOpacity>

      {isVerified && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('ResetPassword', { email, token })}>
          <Text style={[styles.buttonText,{color:theme.text}]}>{t('resetPassword')}</Text>
        </TouchableOpacity>
      )}
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginBottom: 12,
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
  backText: {fontSize: 16,},
});
