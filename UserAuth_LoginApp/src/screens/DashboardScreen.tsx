import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';

type DashboardProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardProp>();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     if (!token) {
  //       navigation.navigate('Login');
  //       return;
  //     }
  //     try {
  //       await axios.get('http://10.0.2.2:5017/api/auth/validate-token', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log('Token validated successfully');
  //     } catch (error: any) {
  //       console.error('Token validation error:', {
  //         status: error.response?.status,
  //         data: error.response?.data,
  //         message: error.message,
  //       });
  //       navigation.navigate('Login');
  //     }
  //   };
  //   checkAuth();
  // }, [navigation]);

  // const refreshToken = async () => {
  //   try {
  //     const refreshToken = await AsyncStorage.getItem('refreshToken');
  //     if (!refreshToken) {
  //       navigation.navigate('Login');
  //       return;
  //     }
  //     const res = await axios.post('http://10.0.2.2:5017/api/auth/refresh-token', {
  //       refreshToken,
  //     });
  //     await AsyncStorage.setItem('accessToken', res.data.accessToken);
  //     await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
  //     console.log('Token refreshed successfully');
  //   } catch (error: any) {
  //     console.error('Token refresh failed:', {
  //       status: error.response?.status,
  //       data: error.response?.data,
  //       message: error.message,
  //     });
  //     navigation.navigate('Login');
  //   }
  // };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
      Alert.alert('Success', 'Logged out successfully');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Dashboard</Text>
      <Text style={styles.subtitle}>You are successfully logged in!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')} >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>

     <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
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
    backgroundColor: '#0b132b',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5bc0be',
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});