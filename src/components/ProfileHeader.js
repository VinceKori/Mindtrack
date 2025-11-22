// src/components/ProfileHeader.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProfileHeader = ({ isEditing, onEditToggle }) => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            if (!currentUser) return;
            
            try {
                const userDoc = await getDoc(doc(db, 'User', currentUser.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name || 'User');
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        fetchUserName();
    }, [currentUser]);

    return (
        <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                {/* Avatar */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#4A90E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#FFFFFF'
                }}>
                    {userName.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* User Info */}
                <div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: theme.text,
                        margin: '0 0 5px 0'
                    }}>
                        {userName || 'Loading...'}
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: theme.textLight,
                        margin: 0
                    }}>
                        {currentUser?.email}
                    </p>
                </div>
            </div>

            {/* Edit Button */}
            <button
                onClick={onEditToggle}
                style={{
                    padding: '10px 24px',
                    backgroundColor: isEditing ? theme.inputBg : theme.primary,
                    color: isEditing ? theme.text : '#FFFFFF',
                    border: isEditing ? `1px solid ${theme.border}` : 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    if (isEditing) {
                        e.target.style.backgroundColor = '#E9ECEF';
                    } else {
                        e.target.style.backgroundColor = '#357ABD';
                    }
                }}
                onMouseOut={(e) => {
                    if (isEditing) {
                        e.target.style.backgroundColor = '#F8F9FA';
                    } else {
                        e.target.style.backgroundColor = '#4A90E2';
                    }
                }}
            >
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
        </div>
    );
};

export default ProfileHeader;
