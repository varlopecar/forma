import { useTranslation } from "react-i18next";
import i18n from "~/lib/i18n";

export function useAppTranslation(namespace: string) {
  const { t, i18n } = useTranslation(namespace);
  return { t, i18n };
}

export const setLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    return true;
  } catch (error) {
    console.error("Error changing language:", error);
    return false;
  }
};
