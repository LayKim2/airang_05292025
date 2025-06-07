"use client"
import { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <div className="flex gap-2 items-center">
      <button
        className={`px-3 py-1 rounded ${language === 'ko' ? 'bg-violet-600 text-white' : 'bg-white text-violet-600'}`}
        onClick={() => { alert('ko'); setLanguage('ko'); }}
      >
        한국어
      </button>
      <button
        className={`px-3 py-1 rounded ${language === 'en' ? 'bg-violet-600 text-white' : 'bg-white text-violet-600'}`}
        onClick={() => { alert('en'); setLanguage('en'); }}
      >
        English
      </button>
    </div>
  );
} 