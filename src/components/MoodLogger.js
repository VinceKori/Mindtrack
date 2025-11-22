// src/components/MoodLogger.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const MoodLogger = () => {
    const { currentUser } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleMoodClick = async (mood) => {
        if (!currentUser) return;

        setSelectedMood(mood);
        setIsSaving(true);

        try {
            await addDoc(collection(db, 'MoodEntry'), {
                user_id: currentUser.uid,
                mood_type: mood,
                note: '',
                timestamp: new Date(),
            });
            
            alert(`Mood (${mood}) logged successfully!`);

        } catch (error) {
            console.error("Error logging mood:", error);
            alert("Failed to save mood. Please try again.");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSelectedMood(null), 2000);
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

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '15px'
            }}>
                {[
                    { icon: '😀', label: 'Happy', mood: 'Happy ��' },
                    { icon: '😥', label: 'Sad', mood: 'Sad 😥' },
                    { icon: '😟', label: 'Anxious', mood: 'Anxious 😟' },
                    { icon: '😐', label: 'Neutral', mood: 'Neutral 😐' }
                ].map(item => (
                    <button
                        key={item.mood}
                        onClick={() => handleMoodClick(item.mood)}
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
};

export default MoodLogger;
