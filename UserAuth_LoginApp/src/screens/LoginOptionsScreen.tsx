// src/screens/LoginOptionsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type LoginOptionsProp = NativeStackNavigationProp<RootStackParamList, 'LoginOptions'>;

export default function LoginOptionsScreen() {
  const navigation = useNavigation<LoginOptionsProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Login Options</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginViaEmail')}
      >
        <Text style={styles.buttonText}>Login via Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginViaMobile')}
      >
        <Text style={styles.buttonText}>Login via Mobile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b132b',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#5bc0be',
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
