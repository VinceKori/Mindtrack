import React from 'react';

const ResourceSearch = ({ searchTerm, onSearchChange }) => {
    return (
        <div style={{
            position: 'relative',
            marginBottom: '30px'
        }}>
            <div style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C757D',
                fontSize: '18px'
            }}>
                🔍
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for articles, meditations..."
                style={{
                    width: '100%',
                    padding: '15px 15px 15px 45px',
                    fontSize: '15px',
                    border: '1px solid #E1E8ED',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#2C3E50',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#4A90E2';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#E1E8ED';
                }}
            />
        </div>
    );
};

export default ResourceSearch;
