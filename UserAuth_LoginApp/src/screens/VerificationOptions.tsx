import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type VerificationOptionsProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationOptions'
>;

export default function VerificationOptionsScreen() {
  const navigation = useNavigation<VerificationOptionsProp>();
  const route = useRoute();
  const { email, mobile } = route.params as { email: string; mobile: string };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Verification Type</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerifyEmail', { email })}
      >
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerifyMobile', { mobile })}
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
