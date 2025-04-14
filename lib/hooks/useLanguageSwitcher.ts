import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";

const LANGUAGE_KEY = "@app_language";

export type Language = {
  code: string;
  name: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  // Add more languages as needed
];

export const useLanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      setIsLoading(true);
      const savedLanguageCode = await AsyncStorage.getItem(LANGUAGE_KEY);

      if (savedLanguageCode) {
        const language = SUPPORTED_LANGUAGES.find(
          (lang) => lang.code === savedLanguageCode
        );
        if (language) {
          setCurrentLanguage(language);
          i18n.changeLanguage(language.code);
        } else {
          // Default to English if saved language is not supported
          const defaultLanguage = SUPPORTED_LANGUAGES[0];
          setCurrentLanguage(defaultLanguage);
          await AsyncStorage.setItem(LANGUAGE_KEY, defaultLanguage.code);
          i18n.changeLanguage(defaultLanguage.code);
        }
      } else {
        // Default to English if no language is saved
        const defaultLanguage = SUPPORTED_LANGUAGES[0];
        setCurrentLanguage(defaultLanguage);
        await AsyncStorage.setItem(LANGUAGE_KEY, defaultLanguage.code);
        i18n.changeLanguage(defaultLanguage.code);
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
      // Default to English if there's an error
      const defaultLanguage = SUPPORTED_LANGUAGES[0];
      setCurrentLanguage(defaultLanguage);
      i18n.changeLanguage(defaultLanguage.code);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      const language = SUPPORTED_LANGUAGES.find(
        (lang) => lang.code === languageCode
      );
      if (language) {
        await AsyncStorage.setItem(LANGUAGE_KEY, language.code);
        setCurrentLanguage(language);
        i18n.changeLanguage(language.code);
      }
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  return {
    currentLanguage: currentLanguage || SUPPORTED_LANGUAGES[0],
    isLoading,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};
