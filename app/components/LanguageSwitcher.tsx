"use client"
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageProvider";
import { Icon } from '@iconify/react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center justify-center w-full rounded-xl border border-white/10 shadow-sm px-3 py-1.5 bg-white/5 backdrop-blur-sm text-sm font-medium text-gray-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
        id="language-menu"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {language === 'en' ? (
          <Icon icon="twemoji:flag-united-states" width="20" height="20" />
        ) : (
          <Icon icon="twemoji:flag-south-korea" width="20" height="20" />
        )}
      </button>
      {showDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-20 rounded-xl shadow-lg bg-white/5 backdrop-blur-sm ring-1 ring-white/10 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            <button
              onClick={() => {
                setLanguage('ko');
                setShowDropdown(false);
                if (typeof window !== 'undefined') localStorage.setItem('airang_lang', 'ko');
              }}
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-200"
              role="menuitem"
            >
              <Icon icon="twemoji:flag-south-korea" width="20" height="20" />
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                setShowDropdown(false);
                if (typeof window !== 'undefined') localStorage.setItem('airang_lang', 'en');
              }}
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors duration-200"
              role="menuitem"
            >
              <Icon icon="twemoji:flag-united-states" width="20" height="20" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 