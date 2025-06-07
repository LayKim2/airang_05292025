"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ko',
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<'ko' | 'en'>("ko");

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('airang_lang') : null;
    if (stored === 'ko' || stored === 'en') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: 'ko' | 'en') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('airang_lang', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
} 