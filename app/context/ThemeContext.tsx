import { createContext, useContext, useState } from 'react';
import { Colors, LightColors } from '../constants/theme';

type ColorPalette = typeof Colors;

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  C: ColorPalette;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  C: Colors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const C = isDark ? Colors : LightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, C }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
