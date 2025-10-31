import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemesContext';
import { useLanguage } from '../context/LanguageContext';

type VerificationOptionsProp = NativeStackNavigationProp<RootStackParamList, 'VerificationOptions'>;
type VerificationOptionsRouteProp = RouteProp<RootStackParamList, 'VerificationOptions'>;

export default function VerificationOptionsScreen() {
  const navigation = useNavigation<VerificationOptionsProp>();
  const route = useRoute<VerificationOptionsRouteProp>();
  const { email, mobile, userId } = route.params;
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, {color:theme.text}]}>{t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title,{color:theme.text}]}>{t('chooseVerification')}</Text>

      <TouchableOpacity
        style={[styles.button,{ backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('VerifyEmail', { email, mobile, userId })}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t('verifyEmail')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VerifyMobile', { email, mobile, userId })}>
        <Text style={[styles.buttonText, { color: theme.text }]}>{t('verifyMobile')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  title: { fontSize: 22, marginBottom: 30 },
  button: { borderRadius: 8, paddingVertical: 14, width: '80%', marginVertical: 8 },
  buttonText: { textAlign: 'center', fontWeight: '600' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { fontSize: 16 },
});