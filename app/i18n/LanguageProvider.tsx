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
    // localStorage에서 저장된 언어 설정 확인
    const stored = typeof window !== 'undefined' ? localStorage.getItem('airang_lang') : null;
    if (stored === 'ko' || stored === 'en') {
      setLanguageState(stored);
      return;
    }

    // localStorage에 저장된 설정이 없으면 브라우저 언어 확인
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const defaultLang = browserLang.startsWith('ko') ? 'ko' : 'en';
    
    setLanguageState(defaultLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('airang_lang', defaultLang);
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