import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'Home': { en: 'Home', ta: 'முகப்பு' },
  'Shop': { en: 'Shop', ta: 'கடை' },
  'About Us': { en: 'About Us', ta: 'எங்களைப் பற்றி' },
  'Admin Panel': { en: 'Admin Panel', ta: 'நிர்வாகக் குழு' },
  'Login': { en: 'Login', ta: 'உள்நுழைய' },
  'Logout': { en: 'Logout', ta: 'வெளியேறு' },
  'My Profile': { en: 'My Profile', ta: 'என் சுயவிவரம்' },
  'Add to Cart': { en: 'Add to Cart', ta: 'கூடையில் சேர்' },
  'Out of Stock': { en: 'Out of Stock', ta: 'இருப்பு இல்லை' },
  'Seasonal': { en: 'Seasonal', ta: 'பருவகால' },
  'Checkout': { en: 'Checkout', ta: 'செக்அவுட்' },
  'Total': { en: 'Total', ta: 'மொத்தம்' },
  'Order Summary': { en: 'Order Summary', ta: 'ஆர்டர் சுருக்கம்' },
  'Proceed to Checkout': { en: 'Proceed to Checkout', ta: 'பணம் செலுத்த தொடரவும்' },
  'Search': { en: 'Search', ta: 'தேடு' },
  'Filter': { en: 'Filter', ta: 'வடிகட்டி' },
  'Sort': { en: 'Sort', ta: 'வரிசைப்படுத்து' },
  'Your Cart is Empty': { en: 'Your Cart is Empty', ta: 'உங்கள் கூடை காலியாக உள்ளது' },
  'Continue Shopping': { en: 'Continue Shopping', ta: 'தொடர்ந்து ஷாப்பிங் செய்' },
  'Payment': { en: 'Payment', ta: 'பணம் செலுத்துதல்' },
  'Place Order': { en: 'Place Order', ta: 'ஆர்டரை உறுதி செய்' },
  'Processing': { en: 'Processing', ta: 'செயலாக்கத்தில்' },
  'Shipped': { en: 'Shipped', ta: 'அனுப்பப்பட்டது' },
  'Delivered': { en: 'Delivered', ta: 'வழங்கப்பட்டது' },
  'Cancelled': { en: 'Cancelled', ta: 'ரத்து செய்யப்பட்டது' },
  'Pending': { en: 'Pending', ta: 'நிலுவையில்' },
  'Verified': { en: 'Verified', ta: 'சரிபார்க்கப்பட்டது' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
