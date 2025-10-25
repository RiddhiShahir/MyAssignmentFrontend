import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define what a theme looks like (like a list of colors)
interface Theme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
}

// Define two themes: light and dark
const lightTheme: Theme = {
  background: '#FFFFFF', // White background
  text: '#000000',      // Black text
  primary: '#9365d4ff',   // Purple for buttons
  secondary: '#03DAC6', // Teal for buttons
};

const darkTheme: Theme = {
  background: '#121212', // Dark background
  text: '#FFFFFF',      // White text
  primary: '#BB86FC',   // Light purple for buttons
  secondary: '#03DAC6', // Teal for buttons
};

// Define the context (like a box that holds the theme)
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider wraps the app to share the theme
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Start with dark theme
  const [theme, setTheme] = useState(darkTheme);

  // Load saved theme when app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          const isDarkMode = savedTheme === 'dark';
          setIsDark(isDarkMode);
          setTheme(isDarkMode ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.log('Could not load theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Toggle between light and dark, and save the choice
  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Could not save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper to use the theme in other files
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};