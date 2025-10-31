import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';


type DashboardProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardProp>();
  const { theme } = useTheme();
  const { t } = useLanguage();


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

  
  // Disable back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Prevent going back
      return true;
    });

    return () => backHandler.remove(); // cleanup on unmount
  }, []);

const handleLogout = async () => {
    Alert.alert(t('logout'), t('logoutconfirmation'), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('userId');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <Text style={[styles.title,{color:theme.text}]}>{t('Welcome')}</Text>
      <Text style={[styles.subtitle,{color:theme.text}]}>{t('msg')}</Text>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Profile')} >
        <Text style={[styles.buttonText,{color:theme.text}]}>{t('ViewProfile')}</Text>
      </TouchableOpacity>

     <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={handleLogout}>
        <Text style={[styles.buttonText,{color:theme.text}]}>{t('logout')}</Text>
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