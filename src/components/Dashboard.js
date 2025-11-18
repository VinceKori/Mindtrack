// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import DailyVerse from './DailyVerse';
import MoodLogger from './MoodLogger';
import MoodTrends from './MoodTrends';
import SelfCareGoalForm from './SelfCareGoalForm';
import GoalTracker from './GoalTracker';
import ResourceList from './ResourceList';
import EmergencyContacts from './EmergencyContacts';
import WelcomeBanner from './WelcomeBanner'; 
import { useAuth } from '../AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isWide, setIsWide] = useState(window.innerWidth > 1000); 

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth > 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🎨 Calm color palette
    const colors = {
        primary: '#6a82fb',
        secondary: '#f7f9fc',
        text: '#4a4a4a',
        danger: '#e55353',
        cardBorder: '#d4e1f5'
    };
    
    const HEADER_HEIGHT = '80px'; 
    const HEADER_PADDING_X = '30px'; // Horizontal padding for content
    const HEADER_BACKGROUND = colors.secondary; 
    const MAX_WIDTH = '1200px';

    // 🎨 Reusable Card Style
    const cardBoxStyle = {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.cardBorder}`,
        minWidth: 0, 
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to log out. Please try again.");
        }
    };
    
    // LOGIC: Determine the display name for the header
    const userDisplayName = currentUser?.displayName 
        ? currentUser.displayName.split(' ')[0]
        : (currentUser?.email.split('@')[0] || 'User'); 

    // Capitalize the first letter for a clean display
    const formattedDisplayName = userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1);


    return (
        <div style={{
            backgroundImage: `linear-gradient(to bottom right, ${colors.secondary}, #eff1ff)`,
            minHeight: '100vh',
            padding: '0', 
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* ----------------- Header (Fixed Position - Full Width) ----------------- */}
            <header style={{
                position: 'fixed',
                top: 0,
                width: '100%', // Takes up full viewport width
                zIndex: 1000,
                backgroundColor: HEADER_BACKGROUND,
                borderBottom: `1px solid ${colors.cardBorder}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                // New: Center the content container within the fixed header
                display: 'flex', 
                justifyContent: 'center',
            }}>
                {/* ⭐️ KEY CHANGE: Inner div to constrain and hold content layout */}
                <div style={{
                    maxWidth: MAX_WIDTH,
                    width: '100%', // Important for the content to spread within max width
                    height: HEADER_HEIGHT, 
                    padding: `0 ${HEADER_PADDING_X}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1 style={{ color: colors.primary, fontSize: '28px', fontWeight: 'bold' }}>MindTrack 🧠</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <p style={{ color: colors.text, fontSize: '14px' }}>
                            Hello, {formattedDisplayName} 
                        </p>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: colors.danger,
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>
            {/* ----------------- End Header ----------------- */}

            {/* --------------------------- Main Balanced Grid --------------------------- */}
            <main style={{
                // Offset padding remains necessary to move content below fixed header
                paddingTop: HEADER_HEIGHT, 
                maxWidth: MAX_WIDTH,
                margin: '0 auto',
                paddingRight: '30px',
                paddingLeft: '30px',
                paddingBottom: '30px',
                display: 'grid',
                gridTemplateColumns: isWide ? '2fr 1fr' : '1fr', 
                gap: '30px',
            }}>
                
                {/* ... Main content columns remain unchanged ... */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={cardBoxStyle}>
                        <WelcomeBanner currentUser={currentUser} colors={colors} /> 
                    </div>
                    <div style={cardBoxStyle}>
                        <DailyVerse />
                    </div>
                    <div style={cardBoxStyle}>
                        <MoodLogger />
                    </div>
                    <div style={cardBoxStyle}>
                        <MoodTrends />
                    </div>
                    <div style={cardBoxStyle}>
                        <SelfCareGoalForm />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={cardBoxStyle}>
                        <GoalTracker />
                    </div>
                    <div style={{ ...cardBoxStyle, padding: '0' }}> 
                        <ResourceList /> 
                    </div>
                    <div style={cardBoxStyle}>
                        <EmergencyContacts />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;