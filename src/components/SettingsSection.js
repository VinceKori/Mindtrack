// src/components/SettingsSection.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

const SettingsSection = () => {
    const { currentUser, logout } = useAuth();
    const { isDarkMode, setIsDarkMode, theme } = useTheme();
    const [settings, setSettings] = useState({
        pushNotifications: true,
        darkMode: false,
        anonymousData: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            if (!currentUser) return;
            
            try {
                const settingsDoc = await getDoc(doc(db, 'UserSettings', currentUser.uid));
                if (settingsDoc.exists()) {
                    const data = settingsDoc.data();
                    setSettings(data);
                    setIsDarkMode(data.darkMode || false);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, [currentUser, setIsDarkMode]);

    const handleToggle = async (settingName) => {
        if (!currentUser) return;

        const newSettings = {
            ...settings,
            [settingName]: !settings[settingName]
        };

        setSettings(newSettings);
        
        // Update theme context immediately if toggling dark mode
        if (settingName === 'darkMode') {
            setIsDarkMode(newSettings.darkMode);
        }

        try {
            await setDoc(doc(db, 'UserSettings', currentUser.uid), newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
            // Revert on error
            setSettings(settings);
            if (settingName === 'darkMode') {
                setIsDarkMode(settings.darkMode);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (!confirmed) return;

        const doubleConfirm = window.prompt(
            'Type "DELETE" to confirm account deletion:'
        );

        if (doubleConfirm !== 'DELETE') {
            alert('Account deletion cancelled.');
            return;
        }

        try {
            // Delete user data from Firestore
            // Note: In production, this should be done via Cloud Functions
            await deleteUser(currentUser);
            alert('Account deleted successfully.');
            logout();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again or contact support.');
        }
    };

    const toggleStyle = (isOn) => ({
        width: '44px',
        height: '24px',
        backgroundColor: isOn ? '#4A90E2' : '#DEE2E6',
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    });

    const toggleKnobStyle = (isOn) => ({
        width: '20px',
        height: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: isOn ? '22px' : '2px',
        transition: 'left 0.2s'
    });

    return (
        <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.border}`
        }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: theme.text,
                marginTop: 0,
                marginBottom: '20px'
            }}>
                Settings
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
            }}>
                {/* Push Notifications Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.text,
                            marginBottom: '4px'
                        }}>
                            Push Notifications
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: theme.textLight
                        }}>
                            Receive reminders and updates
                        </div>
                    </div>
                    <div
                        onClick={() => handleToggle('pushNotifications')}
                        style={toggleStyle(settings.pushNotifications)}
                    >
                        <div style={toggleKnobStyle(settings.pushNotifications)} />
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.text,
                            marginBottom: '4px'
                        }}>
                            Dark Mode
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: theme.textLight
                        }}>
                            Switch to dark theme
                        </div>
                    </div>
                    <div
                        onClick={() => handleToggle('darkMode')}
                        style={toggleStyle(settings.darkMode)}
                    >
                        <div style={toggleKnobStyle(settings.darkMode)} />
                    </div>
                </div>

                {/* Anonymous Data Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.text,
                            marginBottom: '4px'
                        }}>
                            Anonymous Data Collection
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: theme.textLight
                        }}>
                            Help improve the app
                        </div>
                    </div>
                    <div
                        onClick={() => handleToggle('anonymousData')}
                        style={toggleStyle(settings.anonymousData)}
                    >
                        <div style={toggleKnobStyle(settings.anonymousData)} />
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    backgroundColor: theme.border,
                    margin: '10px 0'
                }} />

                {/* Delete Account Button */}
                <button
                    onClick={handleDeleteAccount}
                    style={{
                        padding: '12px',
                        backgroundColor: theme.cardBg,
                        color: '#DC3545',
                        border: '1px solid #DC3545',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#DC3545';
                        e.target.style.color = '#FFFFFF';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = theme.cardBg;
                        e.target.style.color = '#DC3545';
                    }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default SettingsSection;
