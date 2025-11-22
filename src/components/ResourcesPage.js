import React, { useState } from 'react';
import ResourceHero from './ResourceHero';
import ResourceSearch from './ResourceSearch';
import ResourceFilters from './ResourceFilters';
import ResourceCard from './ResourceCard';

const ResourcesPage = ({ onNavigateToTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [displayCount, setDisplayCount] = useState(6);

    // Resource data
    const resources = [
        {
            id: 1,
            type: 'article',
            title: 'Understanding Burnout and How to Cope',
            description: 'Learn to recognize the signs of burnout and discover effective strategies for recovery.',
            imageColor: '#FFE5D9',
            duration: '5 min read',
            category: ['stress', 'burnout', 'article'],
            link: 'https://www.helpguide.org/articles/stress/burnout-prevention-and-recovery.htm'
        },
        {
            id: 2,
            type: 'meditation',
            title: 'Guided Meditation for a Peaceful Morning',
            description: 'Start your day with intention and tranquility through this guided practice.',
            imageColor: '#FFD7A8',
            duration: '10 min listen',
            category: ['meditation', 'stress'],
            link: 'https://www.youtube.com/watch?v=ZToicYcHIOU'
        },
        {
            id: 3,
            type: 'exercise',
            title: 'The 4-7-8 Breathing Technique',
            description: 'A simple yet powerful breathing exercise to calm anxiety and reduce stress.',
            imageColor: '#C1E1C1',
            duration: '3 min exercise',
            category: ['anxiety', 'exercise'],
            link: 'https://www.healthline.com/health/4-7-8-breathing'
        },
        {
            id: 4,
            type: 'article',
            title: 'Journaling for Mental Clarity',
            description: 'Discover how the simple act of writing can help organize thoughts and reduce stress.',
            imageColor: '#E8E8E8',
            duration: '7 min read',
            category: ['stress', 'article'],
            link: 'https://www.urmc.rochester.edu/encyclopedia/content?ContentTypeID=1&ContentID=4552'
        },
        {
            id: 5,
            type: 'meditation',
            title: 'Meditation for Restful Sleep',
            description: 'Ease into a calm and restorative sleep with this calming guided meditation.',
            imageColor: '#1A3B5D',
            duration: '15 min listen',
            category: ['meditation', 'stress'],
            link: 'https://www.youtube.com/watch?v=aEqlQvczMJQ'
        },
        {
            id: 6,
            type: 'exercise',
            title: 'Mindful Walking Exercise',
            description: 'Connect with your surroundings and calm your mind with this simple walking practice.',
            imageColor: '#A8D5A8',
            duration: '10 min exercise',
            category: ['exercise', 'stress'],
            link: 'https://www.mindful.org/how-to-practice-mindful-walking/'
        },
        {
            id: 7,
            type: 'article',
            title: 'Managing Anxiety in Daily Life',
            description: 'Practical tips and strategies for managing anxiety and staying grounded.',
            imageColor: '#D4E4F7',
            duration: '6 min read',
            category: ['anxiety', 'article'],
            link: 'https://www.anxietycanada.com/articles/how-to-manage-anxiety/'
        },
        {
            id: 8,
            type: 'meditation',
            title: 'Body Scan Meditation',
            description: 'Release tension and promote relaxation through this guided body scan practice.',
            imageColor: '#F4E1C1',
            duration: '12 min listen',
            category: ['meditation', 'stress'],
            link: 'https://www.youtube.com/watch?v=15q-N-_kkrU'
        },
        {
            id: 9,
            type: 'exercise',
            title: 'Progressive Muscle Relaxation',
            description: 'Learn to release physical tension and stress through systematic muscle relaxation.',
            imageColor: '#E8D5F2',
            duration: '8 min exercise',
            category: ['exercise', 'stress', 'anxiety'],
            link: 'https://www.anxietycanada.com/articles/progressive-muscle-relaxation/'
        }
    ];

    // Filter resources based on search and active filter
    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = activeFilter === 'all' || 
                            resource.category.includes(activeFilter) ||
                            resource.type === activeFilter;
        
        return matchesSearch && matchesFilter;
    });

    const displayedResources = filteredResources.slice(0, displayCount);
    const hasMore = displayCount < filteredResources.length;

    return (
        <div style={{ padding: '0' }}>
            <ResourceHero />
            
            <ResourceSearch 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            
            <ResourceFilters 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {/* Results count */}
            <div style={{
                marginBottom: '20px',
                color: '#6C757D',
                fontSize: '14px'
            }}>
                Showing {displayedResources.length} of {filteredResources.length} resources
            </div>

            {/* Resource Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
            }}>
                {displayedResources.map(resource => (
                    <ResourceCard 
                        key={resource.id} 
                        resource={resource}
                    />
                ))}
            </div>

            {/* No results message */}
            {filteredResources.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#6C757D'
                }}>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>No resources found</p>
                    <p style={{ fontSize: '14px' }}>Try adjusting your search or filter</p>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        onClick={() => setDisplayCount(prev => prev + 6)}
                        style={{
                            padding: '12px 32px',
                            fontSize: '15px',
                            fontWeight: '500',
                            backgroundColor: '#4A90E2',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#357ABD';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#4A90E2';
                        }}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;
