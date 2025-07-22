import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';

export type ThemeType = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: ThemeType;
  themeMode: ThemeMode;
  colors: typeof colors.theme.light;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void; // Mantido para compatibilidade
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@poupeai:themeMode';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<ThemeType>(systemTheme || 'light');

  // Carrega o tema salvo no AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Erro ao carregar tema:', error);
      }
    };
    loadTheme();
  }, []);

  // Atualiza o tema baseado no modo selecionado
  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(systemTheme || 'light');
    } else {
      setTheme(themeMode as ThemeType);
    }
  }, [themeMode, systemTheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  // Mantido para compatibilidade (apenas alterna entre light/dark)
  const toggleTheme = () => {
    const newMode = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const currentColors = colors.theme[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        colors: currentColors,
        isDark: theme === 'dark',
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
