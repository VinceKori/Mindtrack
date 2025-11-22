// src/components/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import ProfileHeader from './ProfileHeader';
import PersonalInformation from './PersonalInformation';
import SettingsSection from './SettingsSection';
import ProgressStats from './ProgressStats';
import MoodTrackingChart from './MoodTrackingChart';

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div style={{
            padding: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Page Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '8px'
                }}>
                    Profile
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: theme.textLight,
                    margin: 0
                }}>
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Header Section */}
            <ProfileHeader 
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
            />

            {/* Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginTop: '20px'
            }}>
                {/* Left Column */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <PersonalInformation isEditing={isEditing} />
                    <SettingsSection />
                </div>

                {/* Right Column */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <ProgressStats />
                    <MoodTrackingChart />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
