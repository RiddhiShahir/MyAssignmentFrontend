import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';
import { useLanguage } from './context/LanguageContext';

// Define navigation prop
type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenProp>();

  const {theme} = useTheme();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  // check points for Validations

  const validateForm = (): boolean => {
    let valid = true;
    let newErrors: any = {};

    if (!form.name.trim()) {
      newErrors.name = t('nameRequired');
      valid = false;
    } else if (form.name.trim().length < 3) {
      newErrors.name = t('nameMinLength');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = t('emailRequired');
      valid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = t('emailInvalid');
      valid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!form.mobile.trim()) {
      newErrors.mobile = t('mobileRequired');
      valid = false;
    } else if (!mobileRegex.test(form.mobile)) {
      newErrors.mobile = t('mobileInvalid');
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@_$&!])[A-Za-z\d@_$&!]{8,}$/;
    if (!form.password.trim()) {
      newErrors.password = t('passwordRequired');
      valid = false;
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password = t('passwordPolicy');
      valid = false;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = t('confirmRequired');
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Your API endpoint
  const API_BASE_URL = 'http://10.0.2.2:5017/api/auth/register';

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(API_BASE_URL, {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });

      console.log('Register response:', response.data);

      if (response.status === 200) {
        const { userId } = response.data; // get userId
        Alert.alert(
          t('successTitle'),
          t('successMessage'),
          [
            {
              text: t('proceedBtn'),
              onPress: () =>
                navigation.navigate('Verification', {
                  email: form.email,
                  mobile: form.mobile,
                  userId
                }),
            },
          ]
        );
      } else {
        Alert.alert(t('RegistrationError'));
      }
    } catch (error: any) {
      console.error('Registration Error:', error.response || error.message || error);
      Alert.alert(
        t('errorTitle'),
        t('errorMessage')
      );
    }
  };

  return (
  <View style={[styles.container, {backgroundColor:theme.background}]}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.backText,{color:theme.text}]}> {t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.header, {color: theme.text}]}>{t('userRegistration')}</Text>

      <TextInput
        placeholder={t("name")}
        style={[styles.input,{ backgroundColor: theme.input }]}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        placeholder={t("email")}
        style={[styles.input,{ backgroundColor: theme.input }]}
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}/>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <TextInput
        placeholder={t("mobile")}
        style={[styles.input,{ backgroundColor: theme.input }]}
        value={form.mobile}
        keyboardType="numeric"
        maxLength={10}
        onChangeText={(text) => handleChange('mobile', text)}/>
      {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

      <TextInput
        placeholder={t("password")}
        style={[styles.input,{ backgroundColor: theme.input }]}
        value={form.password}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}/>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TextInput
        placeholder={t("confirmPassword")}
        style={[styles.input,{ backgroundColor: theme.input }]}
        value={form.confirmPassword}
        secureTextEntry
        onChangeText={(text) => handleChange('confirmPassword', text)} />
      {errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      <TouchableOpacity style={[styles.button,{ backgroundColor: theme.primary }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t('submit')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  header: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 5,
    padding: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backText: {fontSize: 16,},
});
