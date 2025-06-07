"use client"
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        id="language-menu"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {language === 'en' ? 'English' : 'Korean'} ▼
      </button>
      {showDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            <button
              onClick={() => {
                setLanguage('ko');
                setShowDropdown(false);
                if (typeof window !== 'undefined') localStorage.setItem('airang_lang', 'ko');
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 hover:text-violet-900"
              role="menuitem"
            >
              Korean
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                setShowDropdown(false);
                if (typeof window !== 'undefined') localStorage.setItem('airang_lang', 'en');
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900"
              role="menuitem"
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 