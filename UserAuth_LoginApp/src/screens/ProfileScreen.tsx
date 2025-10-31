import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return Alert.alert(t('error'), 'Missing token. Please log in again.');

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
      Alert.alert(t('error'), t('failedToFetchProfile'));
    }
  };

  useEffect(() => {
    if (isFocused) fetchProfile();
  }, [isFocused]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('LoadingProfile')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('userProfile')}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('name')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('email')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('mobile')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{profile.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('joinedOn')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {new Date(profile.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('lastUpdated')}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {new Date(profile.lastUpdatedDate).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button,{backgroundColor:theme.primary } ,{ marginTop: 20 }]}
          onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={[styles.buttonText,{color: theme.text}]}>{t('updatePassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button,{backgroundColor: theme.primary}]}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.buttonText, { color: theme.text }]}>{t('editProfile')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { marginTop: 40, marginBottom: 20 },
  backText: {fontSize: 16 },
  title: {
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
