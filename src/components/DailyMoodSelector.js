import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const DailyMoodSelector = () => {
    const { currentUser } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleMoodClick = async (mood) => {
        if (!currentUser) return;

        setSelectedMood(mood);
        setIsSaving(true);

        try {
            await addDoc(collection(db, 'DailyCheckIn'), {
                user_id: currentUser.uid,
                date: new Date(),
                mood: mood,
                timestamp: new Date(),
            });
            
            setTimeout(() => setSelectedMood(null), 2000);

        } catch (error) {
            console.error("Error logging mood:", error);
            alert("Failed to save mood. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const moods = [
        { value: 'Awful', emoji: '😞', label: 'Awful' },
        { value: 'Bad', emoji: '😟', label: 'Bad' },
        { value: 'Okay', emoji: '😐', label: 'Okay' },
        { value: 'Good', emoji: '🙂', label: 'Good' },
        { value: 'Great', emoji: '😄', label: 'Great' }
    ];

    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '8px',
                marginTop: 0
            }}>
                How are you feeling today?
            </h3>
            <p style={{
                fontSize: '14px',
                color: '#6C757D',
                marginBottom: '20px',
                marginTop: 0
            }}>
                Select a mood to describe your day.
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '15px'
            }}>
                {moods.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => handleMoodClick(mood.value)}
                        disabled={isSaving}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '15px 10px',
                            border: 'none',
                            borderRadius: '12px',
                            backgroundColor: selectedMood === mood.value ? '#EFF6FF' : '#F8F9FA',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: selectedMood === mood.value ? '0 2px 8px rgba(74, 144, 226, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedMood !== mood.value && !isSaving) {
                                e.currentTarget.style.backgroundColor = '#E9ECEF';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedMood !== mood.value) {
                                e.currentTarget.style.backgroundColor = '#F8F9FA';
                            }
                        }}
                    >
                        <span style={{ 
                            fontSize: '40px',
                            lineHeight: 1
                        }}>
                            {mood.emoji}
                        </span>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#2C3E50'
                        }}>
                            {mood.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DailyMoodSelector;
