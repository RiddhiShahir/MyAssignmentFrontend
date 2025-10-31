import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../i18n/locales/en.json';
import hi from '../i18n/locales/hi.json';
import mr from '../i18n/locales/mr.json';

type Locale = 'en' | 'hi' | 'mr';
type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  t: (key: keyof Translations) => string;
  setLocale: (l: Locale) => void;
}

const translations: Record<Locale, Translations> = { en, hi, mr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load saved language
  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem('locale')) as Locale | null;
      if (saved && ['en', 'hi', 'mr'].includes(saved)) setLocaleState(saved);
    })();
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    await AsyncStorage.setItem('locale', l);
  };

  const t = (key: keyof Translations): string => {
    return translations[locale][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};