import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type EditProfileProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await axios.get('http://10.0.2.2:5017/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name || '');
        setEmail(res.data.email || '');
        setMobile(res.data.mobile || '');
      } catch {
        Alert.alert('Error', 'Failed to load current profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!name || !email || !mobile)
      return Alert.alert('Error', 'All fields are required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Alert.alert('Invalid Email', 'Please enter a valid email address.');

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile))
      return Alert.alert('Invalid Mobile', 'Mobile number must be 10 digits.');

    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return Alert.alert('Error', 'Missing token.');

    try {
      await axios.put(
        'http://10.0.2.2:5017/api/auth/updateprofile',
        {  name, email, mobile },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Profile updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile"
        placeholderTextColor="#aaa"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b', padding: 20 },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: 'white', fontSize: 16 },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#1c2541',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
