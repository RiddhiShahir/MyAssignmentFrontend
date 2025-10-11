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
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101820FF' },
  title: { color: 'white', fontSize: 22, marginBottom: 30 },
  button: { backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#101820FF', fontSize: 16, fontWeight: 'bold' },
});
