import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

// ✅ Define navigation prop
type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenProp>();

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

  // ✅ Validation
  const validateForm = (): boolean => {
    let valid = true;
    let newErrors: any = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
      valid = false;
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
      valid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
      valid = false;
    } else if (!mobileRegex.test(form.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@_$&!])[A-Za-z\d@_$&!]{8,}$/;
    if (!form.password.trim()) {
      newErrors.password = 'Password is required.';
      valid = false;
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        'Must contain 1 uppercase, 1 lowercase, 1 special char (@, _, $, &, !), and be ≥ 8 chars.';
      valid = false;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ✅ Your API endpoint
  const API_BASE_URL = 'http://10.0.2.2:5017/api/auth/register';

  // ✅ Handle Submit
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
        Alert.alert(
          'Registration Successful',
          'Verification links have been sent to your email and mobile.',
          [
            {
              text: 'Proceed to Verification Screen',
              onPress: () =>
                navigation.navigate('Verification', {
                  email: form.email,
                  mobile: form.mobile,
                }),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to register user. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration Error:', error.response || error.message || error);
      Alert.alert(
        'Network Error',
        'Unable to reach the server. Please check your API URL or connection.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>User Registration</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        value={form.mobile}
        keyboardType="numeric"
        maxLength={10}
        onChangeText={(text) => handleChange('mobile', text)}
      />
      {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={form.password}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={form.confirmPassword}
        secureTextEntry
        onChangeText={(text) => handleChange('confirmPassword', text)}
      />
      {errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#0b132b',
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
    backgroundColor: '#5bc0be',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
