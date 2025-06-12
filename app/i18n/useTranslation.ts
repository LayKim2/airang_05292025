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

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
  const { language } = useLanguage();
  const t = useMemo(() => {
    return (key: string) => getNestedValue(resources[language], key) || key;
  }, [language]);
  return { t, language };
} 