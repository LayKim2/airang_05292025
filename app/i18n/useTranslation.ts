"use client"
import { useMemo } from "react";
import { useLanguage } from "./LanguageProvider";
import ko from "./locales/ko.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";

const resources = {
  ko,
  en,
  ja,
  zh,
};

export function useTranslation() {
  const { language } = useLanguage();
  const t = useMemo(() => {
    return (key: string) => (resources[language] as Record<string, string>)[key] || key;
  }, [language]);
  return { t, language };
} 