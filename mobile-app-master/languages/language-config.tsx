import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/english.json';
import fr from './translations/french.json';

const i18n = new I18n({en, fr});
i18n.defaultLocale = 'fr';
// use default language if user language is not supported
i18n.locale = ['en', 'fr'].includes(Localization.getLocales()[0].languageCode ?? '') ? Localization.getLocales()[0].languageCode ?? i18n.defaultLocale : i18n.defaultLocale;

export const changeLanguage = async (languageCode: string) => {
  i18n.locale = languageCode;
  await AsyncStorage.setItem('user-language', languageCode);
};

export const loadLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem('user-language');
  if (savedLanguage) {
    i18n.locale = savedLanguage;
  }
};

export default i18n;
