"use client"
import { useContext, useMemo } from "react";
import { LanguageContext } from "./LanguageProvider";
import ko from "./locales/ko.json";
import en from "./locales/en.json";

const resources = { ko, en };

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  const t = useMemo(() => {
    return (key: string) => (resources[language] as Record<string, string>)[key] || key;
  }, [language]);
  return { t, language };
} 