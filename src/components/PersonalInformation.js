// src/components/PersonalInformation.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const PersonalInformation = ({ isEditing }) => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;
            
            try {
                const userDoc = await getDoc(doc(db, 'User', currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFormData({
                        name: data.name || '',
                        email: data.email || currentUser.email,
                        phone: data.phone || '',
                        dateOfBirth: data.dateOfBirth || '',
                        gender: data.gender || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!currentUser) return;
        
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'User', currentUser.uid), {
                name: formData.name,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                updatedAt: new Date()
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        fontSize: '14px',
        color: theme.text,
        backgroundColor: isEditing ? theme.cardBg : theme.inputBg,
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: theme.textLight,
        marginBottom: '6px'
    };

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
                Personal Information
            </h3>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {/* Name */}
                <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                </div>

                {/* Email */}
                <div>
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        style={{
                            ...inputStyle,
                            backgroundColor: theme.inputBg,
                            cursor: 'not-allowed'
                        }}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                        style={inputStyle}
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={inputStyle}
                    />
                </div>

                {/* Gender */}
                <div>
                    <label style={labelStyle}>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={inputStyle}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            marginTop: '10px',
                            padding: '12px',
                            backgroundColor: theme.primary,
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PersonalInformation;
