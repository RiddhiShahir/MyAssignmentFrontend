import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type VerificationOptionsProp = NativeStackNavigationProp<RootStackParamList, 'VerificationOptions'>;
type VerificationOptionsRouteProp = RouteProp<RootStackParamList, 'VerificationOptions'>;

export default function VerificationOptionsScreen() {
  const navigation = useNavigation<VerificationOptionsProp>();
  const route = useRoute<VerificationOptionsRouteProp>();
  const { email, mobile, userId } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Verification</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerifyEmail', { email, mobile, userId })}
      >
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerifyMobile', { email, mobile, userId })}
      >
        <Text style={styles.buttonText}>Verify Mobile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b132b' },
  title: { color: 'white', fontSize: 22, marginBottom: 30 },
  button: { backgroundColor: '#5bc0be', borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', color: 'white', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: 'white', fontSize: 16 },
});