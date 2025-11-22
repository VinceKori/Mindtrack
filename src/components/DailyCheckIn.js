import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import MoodCalendar from './MoodCalendar';
import MoodHistory from './MoodHistory';
import DailyMoodSelector from './DailyMoodSelector';
import GratitudeJournal from './GratitudeJournal';
import PrivateJournal from './PrivateJournal';

const DailyCheckIn = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [gratitudeData, setGratitudeData] = useState([]);
    const [journalData, setJournalData] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const getCurrentDate = () => {
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const now = new Date();
        return `Today, ${months[now.getMonth()]} ${now.getDate()}`;
    };

    const handleSaveEntry = async () => {
        if (!currentUser) {
            alert('Please log in to save your entry.');
            return;
        }

        if (gratitudeData.length === 0 && !journalData.trim()) {
            alert('Please add some content before saving.');
            return;
        }

        setIsSaving(true);

        try {
            await addDoc(collection(db, 'DailyCheckIn'), {
                user_id: currentUser.uid,
                date: new Date(),
                gratitude: gratitudeData,
                journal_entry: journalData,
                timestamp: new Date(),
            });
            
            alert('Entry saved successfully!');
            // Clear the form after successful save
            setGratitudeData([]);
            setJournalData('');
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Failed to save entry. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewHistory = () => {
        // TODO: Implement history view modal or navigation
        alert('View History feature coming soon!');
    };

    const cardStyle = {
        padding: '25px',
        backgroundColor: theme.cardBg,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: `1px solid ${theme.border}`,
    };

    return (
        <div style={{
            padding: '0',
            maxWidth: '1400px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '5px',
                    marginTop: 0
                }}>
                    My Daily Check-in
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: theme.textLight,
                    margin: 0
                }}>
                    {getCurrentDate()}
                </p>
            </div>

            {/* Main Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 900 ? '300px 1fr' : '1fr',
                gap: '25px'
            }}>
                {/* Left Column - Calendar & Mood History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={cardStyle}>
                        <MoodCalendar />
                    </div>
                    <div style={cardStyle}>
                        <MoodHistory />
                    </div>
                </div>

                {/* Right Column - Check-in Forms */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* Mood Selector */}
                    <div style={cardStyle}>
                        <DailyMoodSelector />
                    </div>

                    {/* Gratitude Journal */}
                    <div style={cardStyle}>
                        <GratitudeJournal 
                            onSave={setGratitudeData}
                            value={gratitudeData}
                        />
                    </div>

                    {/* Private Journal */}
                    <div style={cardStyle}>
                        <PrivateJournal 
                            onSave={setJournalData}
                            onViewHistory={handleViewHistory}
                            value={journalData}
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveEntry}
                        disabled={isSaving}
                        style={{
                            padding: '15px 30px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#FFFFFF',
                            backgroundColor: isSaving ? theme.textLight : theme.primary,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            alignSelf: 'flex-end'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSaving) {
                                e.target.style.backgroundColor = theme.primaryDark;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSaving) {
                                e.target.style.backgroundColor = theme.primary;
                            }
                        }}
                    >
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyCheckIn;
