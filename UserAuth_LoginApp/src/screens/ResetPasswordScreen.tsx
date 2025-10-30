import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';
import { useLanguage } from './context/LanguageContext';
import PasswordInput from '.././components/PasswordInput';

type ResetPasswordProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<ResetPasswordProp>();
  const route = useRoute<any>();
  const { email: routeEmail, token: routeToken } = route.params;

  const [email, setEmail] = useState(routeEmail || '');
  const [token, setToken] = useState(routeToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleResetPassword = async () => {
    if (!email || !token || !newPassword) {
      return Alert.alert(t('error'), t('pleaseFillAllFields'));
    }
    setLoading(true);
    try {
      const res = await axios.post('http://10.0.2.2:5017/api/auth/resetpassword', {
        email,
        token,
        newPassword,
      });
      Alert.alert(t('success'), res.data.message || t('passwordResetSuccessful'));
      navigation.navigate('LoginViaEmail');
    } catch (error: any) {
      console.error('Reset password error:', error.response?.data || error.message);
      Alert.alert(t('error'), error.response?.data?.error || t('failedToResetPassword'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <Text style={[styles.title,{color:theme.text}]}>{t('resetPassword')}</Text>

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder={t('enterToken')}
        value={token}
        onChangeText={setToken}
      />

      {/* <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder={t('newPassword')}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      /> */}

      <PasswordInput
       placeholder={t('newPassword')}
       value={newPassword}
       onChangeText={setNewPassword}
       style={[styles.input, { backgroundColor: theme.input }]}
      />

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleResetPassword}
        disabled={loading}>
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {loading ? t('resetting') : t('submit')}
        </Text>
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
});
