// src/screens/LoginOptionsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from './context/ThemesContext';

type LoginOptionsProp = NativeStackNavigationProp<RootStackParamList, 'LoginOptions'>;

export default function LoginOptionsScreen() {
  const navigation = useNavigation<LoginOptionsProp>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>Login Options</Text>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('LoginViaEmail')}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Login via Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('LoginViaMobile')}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Login via Mobile</Text>
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
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 40,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
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
