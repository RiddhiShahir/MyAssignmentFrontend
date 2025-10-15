import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to UserAuth & Login App</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')} >
        <Text style={styles.buttonText}>Register User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginOptions')} >
        <Text style={styles.buttonText}>Login</Text>
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 14,
    width: '70%',         // ✅ both buttons same width
    marginVertical: 10,   // ✅ adds spacing between buttons
  },
  buttonText: {
    color: '#101820FF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
