// src/components/JournalHistory.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const JournalHistory = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const fetchEntries = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            const entriesQuery = query(
                collection(db, 'DailyCheckIn'),
                where('user_id', '==', currentUser.uid)
            );

            const snapshot = await getDocs(entriesQuery);
            const fetchedEntries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort in JavaScript instead of Firestore
            fetchedEntries.sort((a, b) => {
                const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
                const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
                return dateB - dateA; // Newest first
            });

            setEntries(fetchedEntries);
        } catch (error) {
            console.error('Error fetching journal entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{ 
                padding: '30px', 
                textAlign: 'center', 
                color: theme.textLight 
            }}>
                Loading your journal entries...
            </div>
        );
    }

    if (selectedEntry) {
        return (
            <div style={{ padding: '0', maxWidth: '900px', margin: '0 auto' }}>
                {/* Back Button */}
                <button
                    onClick={() => setSelectedEntry(null)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: theme.cardBg,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    ← Back to All Entries
                </button>

                {/* Entry Detail */}
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`
                }}>
                    <div style={{ marginBottom: '25px' }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: theme.text,
                            marginBottom: '8px',
                            marginTop: 0
                        }}>
                            {formatDate(selectedEntry.timestamp)}
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: theme.textLight,
                            margin: 0
                        }}>
                            {formatTime(selectedEntry.timestamp)}
                        </p>
                    </div>

                    {/* Gratitude Section */}
                    {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                ✨ What I'm Grateful For
                            </h3>
                            <div style={{
                                backgroundColor: theme.inputBg,
                                borderRadius: '10px',
                                padding: '20px',
                                border: `1px solid ${theme.border}`
                            }}>
                                <ol style={{
                                    margin: 0,
                                    paddingLeft: '20px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    lineHeight: '1.8'
                                }}>
                                    {selectedEntry.gratitude.map((item, idx) => (
                                        <li key={idx} style={{ marginBottom: '10px' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* Journal Entry Section */}
                    {selectedEntry.journal_entry && selectedEntry.journal_entry.trim() && (
                        <div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: theme.text,
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                📝 Private Journal
                            </h3>
                            <div style={{
                                backgroundColor: theme.inputBg,
                                borderRadius: '10px',
                                padding: '20px',
                                border: `1px solid ${theme.border}`
                            }}>
                                <p style={{
                                    margin: 0,
                                    color: theme.text,
                                    fontSize: '15px',
                                    lineHeight: '1.8',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedEntry.journal_entry}
                                </p>
                            </div>
                        </div>
                    )}

                    {!selectedEntry.gratitude?.length && !selectedEntry.journal_entry?.trim() && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: theme.textLight
                        }}>
                            No content in this entry
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '8px',
                    marginTop: 0
                }}>
                    Journal History
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: theme.textLight,
                    margin: 0
                }}>
                    View all your journal entries and gratitude lists
                </p>
            </div>

            {/* Entries List */}
            {entries.length === 0 ? (
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '60px 30px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`,
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📖</div>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: '8px'
                    }}>
                        No Journal Entries Yet
                    </h3>
                    <p style={{
                        fontSize: '15px',
                        color: theme.textLight,
                        marginBottom: '20px'
                    }}>
                        Start journaling by visiting the Track page and saving your first entry.
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gap: '15px'
                }}>
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => setSelectedEntry(entry)}
                            style={{
                                backgroundColor: theme.cardBg,
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: `1px solid ${theme.border}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '12px'
                            }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: theme.text,
                                        marginBottom: '4px',
                                        marginTop: 0
                                    }}>
                                        {formatDate(entry.timestamp)}
                                    </h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: theme.textLight,
                                        margin: 0
                                    }}>
                                        {formatTime(entry.timestamp)}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: '24px'
                                }}>
                                    📖
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                fontSize: '13px',
                                color: theme.textLight
                            }}>
                                {entry.gratitude && entry.gratitude.length > 0 && (
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        ✨ {entry.gratitude.length} gratitude {entry.gratitude.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                                {entry.journal_entry && entry.journal_entry.trim() && (
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        📝 Journal entry
                                    </span>
                                )}
                            </div>

                            {entry.journal_entry && entry.journal_entry.trim() && (
                                <p style={{
                                    marginTop: '12px',
                                    marginBottom: 0,
                                    fontSize: '14px',
                                    color: theme.text,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.5'
                                }}>
                                    {entry.journal_entry}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JournalHistory;
