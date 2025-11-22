import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const MoodCalendar = () => {
    const { currentUser } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [moodData, setMoodData] = useState({});

    useEffect(() => {
        if (currentUser) {
            fetchMonthMoods();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, currentDate]);

    const fetchMonthMoods = async () => {
        if (!currentUser) return;

        try {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const q = query(
                collection(db, 'DailyCheckIn'),
                where('user_id', '==', currentUser.uid),
                where('date', '>=', startOfMonth),
                where('date', '<=', endOfMonth)
            );

            const snapshot = await getDocs(q);
            const moods = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                const date = data.date.toDate().getDate();
                moods[date] = data.mood;
            });
            setMoodData(moods);
        } catch (error) {
            console.error('Error fetching mood data:', error);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getMoodEmoji = (mood) => {
        const moodMap = {
            'Awful': '😞',
            'Bad': '😟',
            'Okay': '😐',
            'Good': '🙂',
            'Great': '😄'
        };
        return moodMap[mood] || '';
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const changeMonth = (delta) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    return (
        <div style={{ padding: '0' }}>
            {/* Month Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => changeMonth(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#6C757D',
                        padding: '5px'
                    }}
                >
                    ‹
                </button>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2C3E50',
                    margin: 0
                }}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                    onClick={() => changeMonth(1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#6C757D',
                        padding: '5px'
                    }}
                >
                    ›
                </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px'
            }}>
                {/* Day headers */}
                {dayNames.map(day => (
                    <div key={day} style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6C757D',
                        padding: '8px 0'
                    }}>
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {getDaysInMonth().map((day, index) => (
                    <div
                        key={index}
                        style={{
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: day && isToday(day) ? '600' : '400',
                            color: day && isToday(day) ? '#FFFFFF' : '#2C3E50',
                            backgroundColor: day && isToday(day) ? '#4A90E2' : 'transparent',
                            borderRadius: '50%',
                            cursor: day ? 'pointer' : 'default',
                            transition: 'background-color 0.2s',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            if (day && !isToday(day)) {
                                e.currentTarget.style.backgroundColor = '#F8F9FA';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (day && !isToday(day)) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        {day && (
                            <>
                                <span style={{ fontSize: '13px' }}>{day}</span>
                                {moodData[day] && (
                                    <span style={{ fontSize: '10px', marginTop: '2px' }}>
                                        {getMoodEmoji(moodData[day])}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodCalendar;
