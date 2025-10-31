import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import axios from 'axios';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';

type VerificationScreenProp = NativeStackNavigationProp<RootStackParamList, 'Verification'>;
type VerificationScreenRouteProp = RouteProp<RootStackParamList, 'Verification'>;

export default function VerificationScreen() {
  const navigation = useNavigation<VerificationScreenProp>();
  const route = useRoute<VerificationScreenRouteProp>();
  const { email, mobile, userId } = route.params; // Include userId
  const { theme } = useTheme();
  const { t } = useLanguage(); // translation

  // Log params to debug
  console.log('VerificationScreen params:', { email, mobile, userId });

  const handleResendVerification = async () => {
    try {
      // Call resend endpoints for email and OTP
      await axios.post('http://10.0.2.2:5017/api/auth/requesttoken', { email });
      await axios.post('http://10.0.2.2:5017/api/auth/requestotp', { mobile });
      Alert.alert(t('resendSuccessMessage'));
    } catch (error: any) {
      console.error(t('resendVerificationError'), {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      Alert.alert(
        t('error'),
        error.response?.data?.error || t('resendErrorMessage')
      );
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('verificationTitle')}</Text>
      <Text style={styles.subtitle}>
        {t('subtitle')}
      </Text>

      <TouchableOpacity style={[styles.button,{ backgroundColor: theme.primary }]} onPress={handleResendVerification}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t('resend')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('VerificationOptions', { email, mobile, userId })}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t('proceed')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 25 },
  button: { borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { fontSize: 16 },
});