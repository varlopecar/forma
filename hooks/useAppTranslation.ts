import { useTranslation } from "react-i18next";
import i18n from "~/lib/i18n";

export const useAppTranslation = (ns?: string | string[]) => {
  const namespaces = ns ? (Array.isArray(ns) ? ns : ns) : ["generic"];

  return useTranslation(namespaces);
};

export const setLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    return true;
  } catch (error) {
    console.error("Error changing language:", error);
    return false;
  }
};
