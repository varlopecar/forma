import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
// Generic translations
import enGeneric from "./locales/en/generic.json";
import esGeneric from "./locales/es/generic.json";
import frGeneric from "./locales/fr/generic.json";

// Business logic translations
import enBusinessLogic from "./locales/en/businessLogic.json";
import esBusinessLogic from "./locales/es/businessLogic.json";
import frBusinessLogic from "./locales/fr/businessLogic.json";

// Page-specific translations
import enSettings from "./locales/en/settings.json";
import esSettings from "./locales/es/settings.json";
import frSettings from "./locales/fr/settings.json";
import enWorkoutAnalysis from "./locales/en/workoutAnalysis.json";
import esWorkoutAnalysis from "./locales/es/workoutAnalysis.json";
import frWorkoutAnalysis from "./locales/fr/workoutAnalysis.json";

// Auth translations
import enAuth from "./locales/en/auth.json";
import esAuth from "./locales/es/auth.json";
import frAuth from "./locales/fr/auth.json";

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      generic: enGeneric,
      businessLogic: enBusinessLogic,
      settings: enSettings,
      workoutAnalysis: enWorkoutAnalysis,
      auth: enAuth,
    },
    es: {
      generic: esGeneric,
      businessLogic: esBusinessLogic,
      settings: esSettings,
      workoutAnalysis: esWorkoutAnalysis,
      auth: esAuth,
    },
    fr: {
      generic: frGeneric,
      businessLogic: frBusinessLogic,
      settings: frSettings,
      workoutAnalysis: frWorkoutAnalysis,
      auth: frAuth,
    },
  },
  fallbackLng: "en",
  defaultNS: "generic",
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
