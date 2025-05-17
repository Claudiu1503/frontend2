import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component that wraps the app and makes language object available to any child component that calls useLanguage()
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(['i18nextLng']);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ro', name: 'Română' }
  ];

  // Initialize language from cookie or browser settings
  useEffect(() => {
    const savedLanguage = cookies.i18nextLng || navigator.language?.split('-')[0] || 'en';
    
    // Check if the saved language is supported, otherwise use English
    const isSupported = languages.some(lang => lang.code === savedLanguage);
    const languageToUse = isSupported ? savedLanguage : 'en';
    
    changeLanguage(languageToUse);
  }, []);

  // Change language function
  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    // Store language preference in cookie (30 days expiration)
    setCookie('i18nextLng', languageCode, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'strict'
    });
  };

  // Value object that will be passed to consumers
  const value = {
    currentLanguage,
    languages,
    changeLanguage
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;