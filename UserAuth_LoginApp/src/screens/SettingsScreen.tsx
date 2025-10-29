import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './context/ThemesContext';
import { useLanguage } from './context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Define navigation prop type
type SettingsScreenProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenProp>();
  const { theme, isDark, toggleTheme } = useTheme(); // Get theme and toggle function
  const { locale, setLocale, t } = useLanguage();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

     {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.backText,{color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>{t('settings')}</Text>

      {/* Theme Toggle */}

      <View style={styles.toggleContainer}>
        <Text style={[styles.label, { color: theme.text }]}>
          {isDark ? t('modedark') : t('modelight')}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={isDark ? theme.secondary : '#f4f3f4'}/>
      </View>

    {/* Language picker */}
      <Text style={[styles.section, { color: theme.text }]}>{t('language')}</Text>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.langBtn,
            {
              backgroundColor:
                locale === lang.code ? theme.primary : theme.secondary,
            },
          ]}
          onPress={() => setLocale(lang.code as any)}
        >
          <Text
            style={[
              styles.langText,
              { color: locale === lang.code ? theme.text : theme.text },
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  langBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
  },
  langText: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
});