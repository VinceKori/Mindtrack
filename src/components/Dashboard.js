// src/components/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import DailyVerse from './DailyVerse';
import MoodLogger from './MoodLogger';
import MoodTrends from './MoodTrends';
import GoalTracker from './GoalTracker';
import DailyCheckIn from './DailyCheckIn';
import ResourcesPage from './ResourcesPage';
import ProfilePage from './ProfilePage';
import CommunitySpace from './CommunitySpace';
import JournalHistory from './JournalHistory';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('home');
    const [isWide, setIsWide] = useState(window.innerWidth > 1000);
    const [showHelplineModal, setShowHelplineModal] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth > 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🎨 Reusable Card Style
    const cardBoxStyle = {
        padding: '25px',
        backgroundColor: theme.cardBg,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: `1px solid ${theme.border}`,
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out. Please try again.');
        }
    };
    
    // LOGIC: Determine the display name
    const userDisplayName = currentUser?.displayName 
        ? currentUser.displayName.split(' ')[0]
        : (currentUser?.email.split('@')[0] || 'User'); 

    // Capitalize the first letter for a clean display
    const formattedDisplayName = userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1);

    // Navigation items
    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'track', icon: '📊', label: 'Track' },
        { id: 'journal', icon: '📖', label: 'Journal' },
        { id: 'resources', icon: '📚', label: 'Resources' },
        { id: 'community', icon: '👥', label: 'Community' }
    ];


    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: theme.background,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        }}>
            {/* Sidebar Navigation */}
            <aside style={{
                width: '240px',
                backgroundColor: theme.sidebarBg,
                borderRight: `1px solid ${theme.border}`,
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '0 25px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '24px' }}>🧠</span>
                    <h1 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: theme.text,
                        margin: 0
                    }}>MindTrack</h1>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '0 15px' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                marginBottom: '8px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: activeView === item.id ? theme.hoverBg : 'transparent',
                                color: activeView === item.id ? theme.primary : theme.textLight,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textAlign: 'left',
                                fontWeight: activeView === item.id ? '500' : '400',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (activeView !== item.id) {
                                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeView !== item.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Profile Section */}
                <div 
                    onClick={() => setActiveView('profile')}
                    style={{
                        padding: '15px 25px',
                        borderTop: `1px solid ${theme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeView === 'profile' ? theme.hoverBg : 'transparent',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'profile') {
                            e.currentTarget.style.backgroundColor = theme.hoverBg;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'profile') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '20px' }}>👤</span>
                    <span style={{
                        fontSize: '15px',
                        color: activeView === 'profile' ? theme.primary : theme.textLight,
                        fontWeight: activeView === 'profile' ? '500' : '400'
                    }}>Profile</span>
                </div>

                {/* Logout Button */}
                <div 
                    onClick={handleLogout}
                    style={{
                        padding: '15px 25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <span style={{ fontSize: '20px' }}>🚪</span>
                    <span style={{
                        fontSize: '15px',
                        color: theme.textLight,
                        fontWeight: '400'
                    }}>Log Out</span>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: '240px',
                flex: 1,
                padding: '40px',
                maxWidth: '1400px'
            }}>
                {/* Conditional Rendering Based on Active View */}
                {activeView === 'track' ? (
                    <DailyCheckIn />
                ) : activeView === 'journal' ? (
                    <JournalHistory />
                ) : activeView === 'resources' ? (
                    <ResourcesPage onNavigateToTrack={() => setActiveView('track')} />
                ) : activeView === 'profile' ? (
                    <ProfilePage />
                ) : activeView === 'community' ? (
                    <CommunitySpace />
                ) : (
                    <>
                        {/* Top Bar with Greeting and Avatar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: theme.text,
                                margin: 0
                            }}>
                                Good morning, {formattedDisplayName}
                            </h2>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: theme.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontSize: '20px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                {formattedDisplayName.charAt(0)}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isWide ? '2fr 1fr' : '1fr',
                            gap: '25px'
                        }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* Verse of the Day */}
                        <div style={cardBoxStyle}>
                            <DailyVerse />
                        </div>

                        {/* Mood Logger and Trends in 2 columns */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
                            gap: '25px'
                        }}>
                            <div style={cardBoxStyle}>
                                <MoodLogger />
                            </div>
                            <div style={cardBoxStyle}>
                                <MoodTrends />
                            </div>
                        </div>

                        {/* Quick Resources */}
                        <div style={cardBoxStyle}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: theme.text,
                                marginBottom: '20px',
                                marginTop: 0
                            }}>Quick Resources</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px'
                            }}>
                                <div 
                                    onClick={() => window.open('https://www.healthline.com/health/breathing-exercises-for-anxiety', '_blank')}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: '#EBF5FF',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>🧘</div>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: theme.text
                                    }}>Breathing Exercises</span>
                                </div>
                                <div 
                                    onClick={() => setShowHelplineModal(true)}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: '#EBF5FF',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>🆘</div>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: theme.text
                                    }}>Crisis Helpline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Self-Care Goals */}
                    <div style={cardBoxStyle}>
                        <GoalTracker />
                    </div>
                </div>
                    </>
                )}
            </main>

            {/* Crisis Helpline Modal */}
            {showHelplineModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowHelplineModal(false)}
                >
                    <div 
                        style={{
                            backgroundColor: theme.background,
                            borderRadius: '16px',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: theme.text,
                                margin: 0
                            }}>Crisis Helplines</h2>
                            <button 
                                onClick={() => setShowHelplineModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    color: theme.textSecondary,
                                    padding: '0',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >×</button>
                        </div>

                        <p style={{
                            color: theme.textSecondary,
                            fontSize: '15px',
                            lineHeight: '1.6',
                            marginBottom: '28px'
                        }}>
                            If you're in crisis or need immediate support, please reach out to these helplines. You're not alone.
                        </p>

                        {/* Befrienders Kenya */}
                        <div style={{
                            backgroundColor: theme.cardBackground,
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            borderLeft: `4px solid ${theme.primary}`
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginTop: 0,
                                marginBottom: '12px'
                            }}>Befrienders Kenya</h3>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="tel:0722178177" style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: theme.primary,
                                    textDecoration: 'none'
                                }}>📞 0722 178 177</a>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="tel:0734666555" style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: theme.primary,
                                    textDecoration: 'none'
                                }}>📞 0734 666 555</a>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="mailto:befriendersken@gmail.com" style={{
                                    fontSize: '14px',
                                    color: theme.textSecondary,
                                    textDecoration: 'none'
                                }}>✉️ befriendersken@gmail.com</a>
                            </div>
                            <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                margin: '8px 0 0 0',
                                lineHeight: '1.5'
                            }}>
                                Available 24/7 for emotional support and suicide prevention
                            </p>
                        </div>

                        {/* Kenya Red Cross */}
                        <div style={{
                            backgroundColor: theme.cardBackground,
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            borderLeft: `4px solid #E53935`
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginTop: 0,
                                marginBottom: '12px'
                            }}>Kenya Red Cross - Psychosocial Support</h3>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="tel:1199" style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#E53935',
                                    textDecoration: 'none'
                                }}>📞 1199</a>
                            </div>
                            <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                margin: '8px 0 0 0',
                                lineHeight: '1.5'
                            }}>
                                Free toll-free number for mental health and psychosocial support
                            </p>
                        </div>

                        {/* Oasis Africa */}
                        <div style={{
                            backgroundColor: theme.cardBackground,
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            borderLeft: `4px solid #43A047`
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginTop: 0,
                                marginBottom: '12px'
                            }}>Oasis Africa</h3>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="tel:+254728444440" style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#43A047',
                                    textDecoration: 'none'
                                }}>📞 +254 728 444 440</a>
                            </div>
                            <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                margin: '8px 0 0 0',
                                lineHeight: '1.5'
                            }}>
                                Mental health counseling and support services
                            </p>
                        </div>

                        {/* KEMRI Wellness Centre */}
                        <div style={{
                            backgroundColor: theme.cardBackground,
                            padding: '20px',
                            borderRadius: '12px',
                            borderLeft: `4px solid #FB8C00`
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginTop: 0,
                                marginBottom: '12px'
                            }}>KEMRI Wellness Centre</h3>
                            <div style={{ marginBottom: '8px' }}>
                                <a href="tel:+254722899779" style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#FB8C00',
                                    textDecoration: 'none'
                                }}>📞 +254 722 899 779</a>
                            </div>
                            <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                margin: '8px 0 0 0',
                                lineHeight: '1.5'
                            }}>
                                Professional mental health services and counseling
                            </p>
                        </div>

                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            backgroundColor: theme.primary + '15',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: theme.textSecondary,
                            lineHeight: '1.6'
                        }}>
                            <strong style={{ color: theme.text }}>Remember:</strong> Seeking help is a sign of strength, not weakness. These services are confidential and here to support you.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;