import React from 'react';

const ResourceHero = () => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #6DD5C3 0%, #A4E0E8 100%)',
            borderRadius: '16px',
            padding: '80px 40px',
            marginBottom: '40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <h1 style={{
                fontSize: '42px',
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: '15px',
                marginTop: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                Find Your Moment of Calm
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#FFFFFF',
                margin: 0,
                opacity: 0.95
            }}>
                Explore curated resources to support your mental well-being.
            </p>
        </div>
    );
};

export default ResourceHero;
