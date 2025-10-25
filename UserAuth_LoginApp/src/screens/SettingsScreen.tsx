import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './context/ThemesContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Define navigation prop type
type SettingsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenProp>();
  const { theme, isDark, toggleTheme } = useTheme(); // Get theme and toggle function

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

     {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.backText,{color:theme.text}]}>← Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <View style={styles.toggleContainer}>
        <Text style={[styles.label, { color: theme.text }]}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={isDark ? theme.secondary : '#f4f3f4'}/>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
  },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: {  fontSize: 16 },
});