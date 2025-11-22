import React, { useState, useEffect } from 'react';

const PrivateJournal = ({ onSave, onViewHistory, value = '' }) => {
    const [journalEntry, setJournalEntry] = useState('');

    // Reset when value prop changes (e.g., after save)
    useEffect(() => {
        if (value === '') {
            setJournalEntry('');
        }
    }, [value]);

    // Pass journal data to parent when changed
    useEffect(() => {
        if (onSave) {
            onSave(journalEntry);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalEntry]);

    return (
        <div style={{ padding: '0' }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '8px'
            }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2C3E50',
                    margin: 0
                }}>
                    Your Private Journal
                </h3>
                <span style={{
                    fontSize: '18px',
                    color: '#6C757D'
                }}>
                    🔒
                </span>
            </div>
            <p style={{
                fontSize: '14px',
                color: '#6C757D',
                marginBottom: '15px',
                marginTop: '5px'
            }}>
                Your entries are private and encrypted.
            </p>

            <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing..."
                style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '15px',
                    fontSize: '15px',
                    color: '#2C3E50',
                    border: '1px solid #E1E8ED',
                    borderRadius: '8px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    marginBottom: '15px',
                    boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#4A90E2';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#E1E8ED';
                }}
            />

            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
            }}>
                <button
                    onClick={onViewHistory}
                    style={{
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#6C757D',
                        backgroundColor: '#F8F9FA',
                        border: '1px solid #E1E8ED',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#E9ECEF';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#F8F9FA';
                    }}
                >
                    View History
                </button>
            </div>
        </div>
    );
};

export default PrivateJournal;
