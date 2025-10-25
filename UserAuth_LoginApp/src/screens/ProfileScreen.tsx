import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';

type ProfileProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  lastUpdatedDate: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileProp>();
  const isFocused = useIsFocused();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { theme } = useTheme();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return Alert.alert('Error', 'Missing token. Please log in again.');

      const response = await axios.get('http://10.0.2.2:5017/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile,
        createdAt: response.data.createdAt,
        lastUpdatedDate: response.data.lastUpdatedDate,
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch profile details.');
    }
  };

  useEffect(() => {
    if (isFocused) fetchProfile();
  }, [isFocused]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>User Profile</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Joined On</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {new Date(profile.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Last Updated</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {new Date(profile.lastUpdatedDate).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button,{ backgroundColor: theme.primary } ,{ marginTop: 20 }]}
          onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.buttonText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: { color: 'white', fontSize: 16 },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    color: '#3a3a3a',
    fontWeight: 'bold',
    fontSize: 16,
    width: 110, // fixed width for clean alignment
  },
  colon: {
    color: '#3a3a3a',
    fontSize: 16,
    fontWeight: 'bold', // makes the colon bold
    width: 10,
    textAlign: 'center',
  },
  value: {
    color: '#000',
    fontSize: 16,
    flexShrink: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
