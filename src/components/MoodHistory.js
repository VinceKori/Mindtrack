import React from 'react';

const MoodHistory = () => {
    return (
        <div style={{ padding: '0', marginTop: '30px' }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '15px',
                marginTop: 0
            }}>
                Your Mood Over Time
            </h3>
            
            <div style={{
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                border: '1px solid #E1E8ED'
            }}>
                <p style={{
                    color: '#6C757D',
                    fontSize: '14px',
                    textAlign: 'center',
                    margin: 0
                }}>
                    Mood chart will be displayed here.
                </p>
            </div>
        </div>
    );
};

export default MoodHistory;
