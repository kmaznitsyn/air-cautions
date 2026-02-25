import { createContext, useContext, useState } from 'react';
import { translations, Locale } from '../constants/i18n';

type LocaleContextType = {
  locale: Locale;
  toggleLocale: () => void;
  t: typeof translations.uk;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: 'uk',
  toggleLocale: () => {},
  t: translations.uk,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('uk');

  const toggleLocale = () =>
    setLocale((prev) => (prev === 'uk' ? 'en' : 'uk'));

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
