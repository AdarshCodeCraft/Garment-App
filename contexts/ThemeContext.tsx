import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState, useMemo } from 'react';

const STORAGE_KEY = 'theme_preference';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  tabBarBackground: string;
  tabBarBorder: string;
  inputBackground: string;
  iconColor: string;
}

const lightColors: ThemeColors = {
  background: '#f9fafb',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  primary: '#2563eb',
  primaryLight: '#eff6ff',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  tabBarBackground: '#ffffff',
  tabBarBorder: '#e5e7eb',
  inputBackground: '#f9fafb',
  iconColor: '#374151',
};

const darkColors: ThemeColors = {
  background: '#111827',
  surface: '#1f2937',
  card: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  primary: '#3b82f6',
  primaryLight: '#1e3a8a',
  border: '#374151',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  tabBarBackground: '#1f2937',
  tabBarBorder: '#374151',
  inputBackground: '#111827',
  iconColor: '#d1d5db',
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState<Theme>('light');

  const themeQuery = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return (stored as Theme) || 'light';
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newTheme: Theme) => {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
      return newTheme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
    },
  });

  const { mutate: saveTheme } = saveMutation;

  useEffect(() => {
    if (themeQuery.data) {
      setTheme(themeQuery.data);
    }
  }, [themeQuery.data]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  }, [theme, saveTheme]);

  const setThemeMode = useCallback((mode: Theme) => {
    setTheme(mode);
    saveTheme(mode);
  }, [saveTheme]);

  const colors = theme === 'light' ? lightColors : darkColors;

  return useMemo(() => ({
    theme,
    colors,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
  }), [theme, colors, toggleTheme, setThemeMode]);
});
