import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ProfileProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return Alert.alert('Error', 'Missing token. Please log in again.');

        const response = await axios.get('http://10.0.2.2:5017/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Profile response:', response.data);

        setProfile({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
          createdAt: response.data.createdAt,
        });
      } catch (error: any) {
        console.error('Profile fetch error:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to fetch profile details.');
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>User Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>{profile.fullName}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{profile.phone}</Text>

        <Text style={styles.label}>Joined:</Text>
        <Text style={styles.value}>
          {new Date(profile.createdAt).toLocaleDateString()}
        </Text>
      </View>
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
  card: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  label: { color: '#3a3a3a', fontWeight: 'bold', marginTop: 10 },
  value: { color: '#000', fontSize: 16 },
  loadingText: { color: 'white', fontSize: 18, textAlign: 'center' },
});
