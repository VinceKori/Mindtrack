import React from 'react';

const ResourceCard = ({ resource, onInternalNavigate }) => {
    const getBadgeColor = (type) => {
        const colors = {
            article: { bg: '#E3F2FD', text: '#1976D2' },
            meditation: { bg: '#FFF3E0', text: '#F57C00' },
            exercise: { bg: '#F1F8E9', text: '#558B2F' }
        };
        return colors[type] || colors.article;
    };

    const badgeColor = getBadgeColor(resource.type);
    const isInternalLink = resource.link.startsWith('/');

    const handleClick = (e) => {
        if (isInternalLink && onInternalNavigate) {
            e.preventDefault();
            onInternalNavigate();
        }
    };

    return (
        <a
            href={resource.link}
            target={isInternalLink ? '_self' : '_blank'}
            rel={isInternalLink ? undefined : 'noopener noreferrer'}
            onClick={handleClick}
            style={{
                display: 'block',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E1E8ED',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Image Section */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                backgroundColor: resource.imageColor || '#E9ECEF',
                backgroundImage: resource.image ? `url(${resource.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                {/* Badge Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    padding: '6px 12px',
                    backgroundColor: badgeColor.bg,
                    color: badgeColor.text,
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {resource.type}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '20px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2C3E50',
                    marginTop: 0,
                    marginBottom: '10px',
                    lineHeight: '1.4'
                }}>
                    {resource.title}
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: '#6C757D',
                    lineHeight: '1.6',
                    marginBottom: '15px',
                    marginTop: 0
                }}>
                    {resource.description}
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px',
                    color: '#6C757D'
                }}>
                    <span>⏱</span>
                    <span>{resource.duration}</span>
                </div>
            </div>
        </a>
    );
};

export default ResourceCard;
