// src/components/MoodTrackingChart.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const MoodTrackingChart = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchMoodData = async () => {
            if (!currentUser) return;

            try {
                const moodQuery = query(
                    collection(db, 'MoodEntry'),
                    where('user_id', '==', currentUser.uid),
                    orderBy('timestamp', 'desc')
                );
                const moodSnapshot = await getDocs(moodQuery);

                // Get last 7 days of data
                const moodMapping = {
                    'Awful 😞': 1,
                    'Bad 😕': 2,
                    'Okay 😐': 3,
                    'Good 😊': 4,
                    'Great 😄': 5
                };

                const last7Days = [];
                const today = new Date();
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    date.setHours(0, 0, 0, 0);
                    last7Days.push(date);
                }

                const moodByDay = {};
                moodSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const timestamp = data.timestamp?.toDate();
                    if (!timestamp) return;

                    const dateKey = new Date(timestamp);
                    dateKey.setHours(0, 0, 0, 0);
                    const key = dateKey.toISOString().split('T')[0];

                    if (!moodByDay[key]) {
                        moodByDay[key] = [];
                    }
                    
                    const moodValue = moodMapping[data.mood_type];
                    if (moodValue) {
                        moodByDay[key].push(moodValue);
                    }
                });

                const labels = last7Days.map(date => 
                    date.toLocaleDateString('en-US', { weekday: 'short' })
                );

                const data = last7Days.map(date => {
                    const key = date.toISOString().split('T')[0];
                    const moods = moodByDay[key];
                    if (!moods || moods.length === 0) return null;
                    return moods.reduce((a, b) => a + b, 0) / moods.length;
                });

                setChartData({
                    labels,
                    datasets: [{
                        label: 'Mood',
                        data,
                        borderColor: theme.primary,
                        backgroundColor: theme.primary === '#4A90E2' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(74, 144, 226, 0.05)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: theme.primary,
                        pointBorderColor: theme.cardBg,
                        pointBorderWidth: 2,
                        fill: true
                    }]
                });

            } catch (error) {
                console.error('Error fetching mood data:', error);
            }
        };

        fetchMoodData();
    }, [currentUser]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: theme.cardBg === '#FFFFFF' ? '#2C3E50' : theme.cardBg,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        if (value === null) return 'No data';
                        
                        let mood = 'Neutral';
                        if (value >= 4.5) mood = 'Great';
                        else if (value >= 3.5) mood = 'Good';
                        else if (value >= 2.5) mood = 'Okay';
                        else if (value >= 1.5) mood = 'Bad';
                        else mood = 'Awful';
                        
                        return `Mood: ${mood}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1,
                    color: theme.textLight,
                    font: {
                        size: 11
                    },
                    callback: function(value) {
                        const labels = ['', 'Awful', 'Bad', 'Okay', 'Good', 'Great'];
                        return labels[value] || '';
                    }
                },
                grid: {
                    color: theme.chartGrid,
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: theme.textLight,
                    font: {
                        size: 11
                    }
                },
                grid: {
                    display: false
                }
            }
        }
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
                Mood Tracking (Last 7 Days)
            </h3>

            <div style={{ height: '250px' }}>
                {chartData ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.textLight,
                        fontSize: '14px'
                    }}>
                        Loading mood data...
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTrackingChart;
