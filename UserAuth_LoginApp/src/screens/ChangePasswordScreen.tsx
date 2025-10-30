import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';
import { useLanguage } from './context/LanguageContext';
import PasswordInput from '.././components/PasswordInput';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('error'), t('Please fill all fields'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('error'), t('New passwords do not match'));
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return Alert.alert(t('error'), t('Missing token. Please log in again.'));

      const response = await axios.post(
        'http://10.0.2.2:5017/api/auth/changepassword',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(t('success'), response.data.message);
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      Alert.alert(t('error'), error.response?.data?.message || t('failedToChangePassword'));
    }
  };

  return (

    <View style={[styles.container,{backgroundColor:theme.background}]}>

     <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('updatePassword')}</Text>

      {/* <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder= {t('CurrentPassword')}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder= {t('NewPassword')}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={[styles.input,{backgroundColor:theme.input}]}
        placeholder= {t('ConfirmNewPassword')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      /> */}

      <PasswordInput
       placeholder={t('CurrentPassword')}
       value={currentPassword}
       onChangeText={setCurrentPassword}
        style={[styles.input, { backgroundColor: theme.input }]}
      />

      <PasswordInput    
        placeholder={t('NewPassword')}
        value={newPassword}
        onChangeText={setNewPassword}
        style={[styles.input, { backgroundColor: theme.input }]}
      />

      <PasswordInput
        placeholder={t('ConfirmNewPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={[styles.input, { backgroundColor: theme.input }]}
      />

      <TouchableOpacity style={[styles.button,{ backgroundColor: theme.primary }]} onPress={handleChangePassword}>
        <Text style={[styles.buttonText,{color : theme.text}]}>{t('updatePassword')}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { 
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { fontWeight: '600' },
  backText: {  textAlign: 'center', marginTop: 10 },
   backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
});
