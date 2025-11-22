// src/components/ProgressStats.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const ProgressStats = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [stats, setStats] = useState({
        totalSessions: 0,
        currentStreak: 0,
        averageMood: 'Neutral'
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!currentUser) return;

            try {
                // Fetch total sessions
                const checkInsQuery = query(
                    collection(db, 'DailyCheckIn'),
                    where('user_id', '==', currentUser.uid)
                );
                const checkInsSnapshot = await getDocs(checkInsQuery);
                const totalSessions = checkInsSnapshot.size;

                // Calculate streak
                const sortedCheckIns = checkInsSnapshot.docs
                    .map(doc => doc.data().timestamp?.toDate())
                    .filter(date => date)
                    .sort((a, b) => b - a);

                let streak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (let i = 0; i < sortedCheckIns.length; i++) {
                    const checkInDate = new Date(sortedCheckIns[i]);
                    checkInDate.setHours(0, 0, 0, 0);
                    
                    const expectedDate = new Date(today);
                    expectedDate.setDate(today.getDate() - i);
                    
                    if (checkInDate.getTime() === expectedDate.getTime()) {
                        streak++;
                    } else {
                        break;
                    }
                }

                // Fetch mood data
                const moodQuery = query(
                    collection(db, 'MoodEntry'),
                    where('user_id', '==', currentUser.uid),
                    orderBy('timestamp', 'desc')
                );
                const moodSnapshot = await getDocs(moodQuery);
                
                // Calculate average mood
                const moodMapping = {
                    'Awful 😞': 1,
                    'Bad 😕': 2,
                    'Okay 😐': 3,
                    'Good 😊': 4,
                    'Great 😄': 5
                };

                let moodSum = 0;
                let moodCount = 0;

                moodSnapshot.docs.forEach(doc => {
                    const mood = doc.data().mood_type;
                    if (moodMapping[mood]) {
                        moodSum += moodMapping[mood];
                        moodCount++;
                    }
                });

                let averageMood = 'Neutral';
                if (moodCount > 0) {
                    const avgValue = moodSum / moodCount;
                    if (avgValue >= 4.5) averageMood = 'Great 😄';
                    else if (avgValue >= 3.5) averageMood = 'Good 😊';
                    else if (avgValue >= 2.5) averageMood = 'Okay 😐';
                    else if (avgValue >= 1.5) averageMood = 'Bad 😕';
                    else averageMood = 'Awful 😞';
                }

                setStats({
                    totalSessions,
                    currentStreak: streak,
                    averageMood
                });

            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [currentUser]);

    const statCardStyle = {
        backgroundColor: theme.inputBg,
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center'
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
                Your Progress
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
            }}>
                {/* Total Sessions */}
                <div style={statCardStyle}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: theme.primary,
                        marginBottom: '5px'
                    }}>
                        {stats.totalSessions}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: theme.textLight,
                        fontWeight: '500'
                    }}>
                        Total Sessions
                    </div>
                </div>

                {/* Current Streak */}
                <div style={statCardStyle}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: theme.primary,
                        marginBottom: '5px'
                    }}>
                        {stats.currentStreak}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: theme.textLight,
                        fontWeight: '500'
                    }}>
                        Day Streak
                    </div>
                </div>

                {/* Average Mood */}
                <div style={{
                    ...statCardStyle,
                    gridColumn: '1 / -1'
                }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: theme.primary,
                        marginBottom: '5px'
                    }}>
                        {stats.averageMood}
                    </div>
                    <div style={{
                        fontSize: '13px',
                        color: theme.textLight,
                        fontWeight: '500'
                    }}>
                        Average Mood
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressStats;
