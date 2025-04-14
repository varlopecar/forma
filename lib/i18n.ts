import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import enHealthScore from "./locales/en/healthScore.json";
import esHealthScore from "./locales/es/healthScore.json";
import enWorkout from "./locales/en/workout.json";
import esWorkout from "./locales/es/workout.json";
import enSettings from "./locales/en/settings.json";
import esSettings from "./locales/es/settings.json";

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      healthScore: enHealthScore,
      workout: enWorkout,
      settings: enSettings,
    },
    es: {
      common: esCommon,
      healthScore: esHealthScore,
      workout: esWorkout,
      settings: esSettings,
    },
    fr: {
      common: frCommon,
    },
  },
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Load saved language or use default
const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("@app_language");
    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
      return;
    }

    // Default to English if no saved language
    await i18n.changeLanguage("en");
  } catch (error) {
    console.error("Error loading language:", error);
    // Default to English if there's an error
    await i18n.changeLanguage("en");
  }
};

// Initialize language
loadLanguage();

export default i18n;
