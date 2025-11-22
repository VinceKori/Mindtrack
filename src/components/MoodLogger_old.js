// src/components/MoodLogger.jsx

import React, { useState } from 'react';
import { db } from '../firebase'; // Firestore DB instance
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // Current user details

// Define colors for the MoodLogger interface
const colors = { primary: '#4c9aff', secondary: '#f0f4f8', text: '#333333' };

// Map mood types to a unique identifier or emoji (optional)
const moodOptions = ['Happy 😀', 'Neutral 😐', 'Sad 😥', 'Anxious 😟', 'Stressed 🥵'];

const MoodLogger = () => {
    const { currentUser } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const logMood = async () => {
        if (!selectedMood) {
            alert("Please select your mood before saving.");
            return;
        }
        if (!currentUser) return;

        setIsSaving(true);

        try {
            await addDoc(collection(db, 'MoodEntry'), {
                user_id: currentUser.uid,
                mood_type: selectedMood,
                note: '',
                timestamp: new Date(),
            });
            
            alert(`Mood (${selectedMood}) logged successfully!`);
            setSelectedMood(null);

        } catch (error) {
            console.error("Error logging mood:", error);
            alert("Failed to save mood. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '15px',
                marginTop: 0
            }}>
                How are you feeling?
            </h3>

            {/* Mood Selection Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '15px'
            }}>
                {[
                    { icon: '😀', label: 'Happy', mood: 'Happy 😀' },
                    { icon: '😥', label: 'Sad', mood: 'Sad 😥' },
                    { icon: '😟', label: 'Anxious', mood: 'Anxious 😟' },
                    { icon: '😐', label: 'Neutral', mood: 'Neutral 😐' }
                ].map(item => (
                    <button
                        key={item.mood}
                        onClick={() => setSelectedMood(item.mood)}
                        disabled={isSaving}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: selectedMood === item.mood ? '#EFF6FF' : '#F8F9FA',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '15px',
                            color: '#2C3E50',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
        <div style={{ padding: '40px', maxWidth: '600px', margin: '50px auto', backgroundColor: colors.secondary, borderRadius: '15px' }}>
            <h2 style={{ color: colors.primary, textAlign: 'center', marginBottom: '30px' }}>
                Mood & Activity Logging
            </h2>
            
            <p style={{ textAlign: 'center', marginBottom: '20px', color: colors.text }}>
                How are you feeling today, {currentUser?.email}?
            </p>

            {/* Mood Selection */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                {moodOptions.map(mood => (
                    <button 
                        key={mood} 
                        onClick={() => setSelectedMood(mood)} 
                        disabled={isSaving}
                        style={{
                            padding: '10px 15px', 
                            borderRadius: '20px', 
                            border: `2px solid ${selectedMood === mood ? colors.primary : colors.text}`,
                            backgroundColor: selectedMood === mood ? colors.primary : 'white',
                            color: selectedMood === mood ? 'white' : colors.text,
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                        }}>
                        {mood}
                    </button>
                ))}
            </div>

            {/* Reflection Text Area */}
            <textarea
                placeholder="Write a personal reflection or detail what influenced your mood..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows="5"
                disabled={isSaving}
                style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    border: `1px solid ${colors.text}`, 
                    marginBottom: '20px', 
                    fontSize: '16px',
                    boxSizing: 'border-box'
                }}
            />
            
            {/* Save Button */}
            <button 
                onClick={logMood}
                disabled={!selectedMood || isSaving}
                style={{ 
                    width: '100%', 
                    padding: '15px', 
                    backgroundColor: isSaving ? '#aaa' : colors.primary, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                }}>
                {isSaving ? 'Saving...' : 'Save Mood Entry'}
            </button>
        </div>
    );
};

export default MoodLogger;