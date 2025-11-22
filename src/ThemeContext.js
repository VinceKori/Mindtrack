// src/ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadThemePreference = async () => {
            if (!currentUser) return;
            
            try {
                const settingsDoc = await getDoc(doc(db, 'UserSettings', currentUser.uid));
                if (settingsDoc.exists()) {
                    setIsDarkMode(settingsDoc.data().darkMode || false);
                }
            } catch (error) {
                console.error('Error loading theme preference:', error);
            }
        };

        loadThemePreference();
    }, [currentUser]);

    const lightTheme = {
        primary: '#4A90E2',
        primaryDark: '#357ABD',
        secondary: '#F8F9FA',
        background: '#F8F9FA',
        cardBg: '#FFFFFF',
        text: '#2C3E50',
        textLight: '#6C757D',
        border: '#E1E8ED',
        sidebarBg: '#FFFFFF',
        hoverBg: '#EFF6FF',
        inputBg: '#F8F9FA',
        chartGrid: '#F0F0F0'
    };

    const darkTheme = {
        primary: '#4A90E2',
        primaryDark: '#357ABD',
        secondary: '#1A1D23',
        background: '#1A1D23',
        cardBg: '#242830',
        text: '#E9ECEF',
        textLight: '#ADB5BD',
        border: '#373B43',
        sidebarBg: '#242830',
        hoverBg: '#2C3139',
        inputBg: '#1A1D23',
        chartGrid: '#373B43'
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const value = {
        isDarkMode,
        setIsDarkMode,
        theme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
