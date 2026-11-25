'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Dictionary } from './types';
import { es } from './dictionaries/es';
import { en } from './dictionaries/en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Dictionary;
}

const dictionaries: Record<Language, Dictionary> = {
  es,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  // Load language from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fototime_lang') as Language;
      if (saved === 'es' || saved === 'en') {
        setLanguageState(saved);
      } else {
        // Detect browser language
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === 'en') setLanguageState('en');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('fototime_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
  };

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
