import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VerifyMobileProp = NativeStackNavigationProp<RootStackParamList, 'VerifyMobile'>;

export default function VerifyMobileScreen() {
  const navigation = useNavigation<VerifyMobileProp>();
  const route = useRoute();
  const { mobile } = route.params as { mobile: string };

  const handleVerifyMobile = async () => {
    try {
      const res = await axios.post('http://192.168.1.18:5017/api/auth/verifyotp', { mobile });
      if (res.status === 200) {
        Alert.alert('Success', 'Mobile number verified successfully!');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Mobile verification failed.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify Mobile</Text>
      <Text style={styles.subtitle}>Mobile: {mobile}</Text>

      <TouchableOpacity style={styles.button} onPress={handleVerifyMobile}>
        <Text style={styles.buttonText}>Verify Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b132b' },
  title: { color: 'white', fontSize: 22, marginBottom: 10 },
  subtitle: { color: '#ccc', marginBottom: 20 },
  button: { backgroundColor: '#5bc0be', borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', color: 'white', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: 'white', fontSize: 16 },
});
