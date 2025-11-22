import React from 'react';

const ResourceFilters = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'article', label: 'Articles' },
        { id: 'meditation', label: 'Meditations' },
        { id: 'exercise', label: 'Exercises' },
        { id: 'stress', label: 'Stress' },
        { id: 'anxiety', label: 'Anxiety' }
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '40px',
            overflowX: 'auto',
            paddingBottom: '5px'
        }}>
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        backgroundColor: activeFilter === filter.id ? '#4A90E2' : '#F8F9FA',
                        color: activeFilter === filter.id ? '#FFFFFF' : '#6C757D',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                        if (activeFilter !== filter.id) {
                            e.target.style.backgroundColor = '#E9ECEF';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeFilter !== filter.id) {
                            e.target.style.backgroundColor = '#F8F9FA';
                        }
                    }}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default ResourceFilters;
