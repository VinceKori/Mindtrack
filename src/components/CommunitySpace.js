// src/components/CommunitySpace.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc, increment } from 'firebase/firestore';

const CommunitySpace = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [showNewDiscussion, setShowNewDiscussion] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState({
        title: '',
        content: '',
        categories: []
    });

    const categories = ['All', 'Anxiety', 'Work Stress', 'Relationships', 'Depression', 'Self-Care'];

    useEffect(() => {
        fetchDiscussions();
    }, [activeCategory]);

    const fetchDiscussions = async () => {
        try {
            let q = query(
                collection(db, 'CommunityDiscussions'),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);
            const discussionsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setDiscussions(discussionsList);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleStartDiscussion = async () => {
        if (!currentUser || !newDiscussion.title.trim() || !newDiscussion.content.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await addDoc(collection(db, 'CommunityDiscussions'), {
                user_id: currentUser.uid,
                username: currentUser.displayName || currentUser.email.split('@')[0],
                title: newDiscussion.title,
                content: newDiscussion.content,
                categories: newDiscussion.categories,
                timestamp: new Date(),
                replies: [],
                replyCount: 0
            });

            setNewDiscussion({ title: '', content: '', categories: [] });
            setShowNewDiscussion(false);
            fetchDiscussions();
        } catch (error) {
            console.error('Error creating discussion:', error);
            alert('Failed to create discussion');
        }
    };

    const handlePostReply = async () => {
        if (!currentUser || !replyText.trim() || !selectedDiscussion) return;

        try {
            const discussionRef = doc(db, 'CommunityDiscussions', selectedDiscussion.id);
            
            const newReply = {
                user_id: currentUser.uid,
                username: currentUser.displayName || currentUser.email.split('@')[0],
                content: replyText,
                timestamp: new Date(),
                supports: 0
            };

            await updateDoc(discussionRef, {
                replies: [...(selectedDiscussion.replies || []), newReply],
                replyCount: increment(1)
            });

            setReplyText('');
            
            // Refresh selected discussion
            const updatedDiscussion = {
                ...selectedDiscussion,
                replies: [...(selectedDiscussion.replies || []), newReply],
                replyCount: (selectedDiscussion.replyCount || 0) + 1
            };
            setSelectedDiscussion(updatedDiscussion);
            
            fetchDiscussions();
        } catch (error) {
            console.error('Error posting reply:', error);
            alert('Failed to post reply');
        }
    };

    const filteredDiscussions = discussions
        .filter(d => activeCategory === 'All' || d.categories?.includes(activeCategory))
        .filter(d => searchQuery === '' || 
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} ${Math.floor(seconds / 60) === 1 ? 'minute' : 'minutes'} ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${Math.floor(seconds / 3600) === 1 ? 'hour' : 'hours'} ago`;
        return `${Math.floor(seconds / 86400)} ${Math.floor(seconds / 86400) === 1 ? 'day' : 'days'} ago`;
    };

    if (selectedDiscussion) {
        return (
            <div style={{ padding: '0', maxWidth: '900px', margin: '0 auto' }}>
                {/* Back Button */}
                <button
                    onClick={() => setSelectedDiscussion(null)}
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
                    ← Back to Discussions
                </button>

                {/* Discussion Header */}
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`,
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            {selectedDiscussion.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>
                                @{selectedDiscussion.username}
                            </div>
                            <div style={{ fontSize: '12px', color: theme.textLight }}>
                                {getTimeAgo(selectedDiscussion.timestamp)}
                            </div>
                        </div>
                    </div>

                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: '12px'
                    }}>
                        {selectedDiscussion.title}
                    </h2>

                    <p style={{
                        fontSize: '15px',
                        color: theme.text,
                        lineHeight: '1.6',
                        marginBottom: '15px'
                    }}>
                        {selectedDiscussion.content}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedDiscussion.categories?.map((cat, idx) => (
                            <span key={idx} style={{
                                padding: '4px 12px',
                                backgroundColor: theme.inputBg,
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: theme.textLight
                            }}>
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Replies */}
                <div style={{ marginBottom: '20px' }}>
                    {(selectedDiscussion.replies || []).map((reply, idx) => (
                        <div key={idx} style={{
                            backgroundColor: theme.cardBg,
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            border: `1px solid ${theme.border}`,
                            marginBottom: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    {reply.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>
                                        @{reply.username}
                                    </div>
                                    <div style={{ fontSize: '12px', color: theme.textLight }}>
                                        {getTimeAgo(reply.timestamp)}
                                    </div>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '14px',
                                color: theme.text,
                                lineHeight: '1.5',
                                marginBottom: '12px'
                            }}>
                                {reply.content}
                            </p>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 8px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: theme.primary,
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}>
                                    ❤️ Support ({reply.supports || 0})
                                </button>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 8px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: theme.textLight,
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}>
                                    💬 Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Input */}
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`
                }}>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Share your thoughts..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.border}`,
                            fontSize: '14px',
                            color: theme.text,
                            backgroundColor: theme.inputBg,
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            marginBottom: '12px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        onClick={handlePostReply}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: theme.primary,
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            float: 'right'
                        }}
                    >
                        Post Reply
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '25px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: '8px',
                        marginTop: 0
                    }}>
                        Community Space
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: theme.textLight,
                        margin: 0
                    }}>
                        Connect with others, share experiences, and offer support in a safe space. Please review our{' '}
                        <span style={{ color: theme.primary, cursor: 'pointer' }}>Community Guidelines</span>.
                    </p>
                </div>
                <button
                    onClick={() => setShowNewDiscussion(true)}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: theme.primary,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    + Start a Discussion
                </button>
            </div>

            {/* New Discussion Modal */}
            {showNewDiscussion && (
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`,
                    marginBottom: '25px'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginTop: 0 }}>
                        Start a New Discussion
                    </h3>
                    <input
                        type="text"
                        placeholder="Discussion title..."
                        value={newDiscussion.title}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.border}`,
                            fontSize: '14px',
                            color: theme.text,
                            backgroundColor: theme.inputBg,
                            marginBottom: '12px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <textarea
                        placeholder="Share your thoughts..."
                        value={newDiscussion.content}
                        onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.border}`,
                            fontSize: '14px',
                            color: theme.text,
                            backgroundColor: theme.inputBg,
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            marginBottom: '12px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', color: theme.textLight, marginBottom: '8px', display: 'block' }}>
                            Select Categories:
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {categories.filter(c => c !== 'All').map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        if (newDiscussion.categories.includes(cat)) {
                                            setNewDiscussion({
                                                ...newDiscussion,
                                                categories: newDiscussion.categories.filter(c => c !== cat)
                                            });
                                        } else {
                                            setNewDiscussion({
                                                ...newDiscussion,
                                                categories: [...newDiscussion.categories, cat]
                                            });
                                        }
                                    }}
                                    style={{
                                        padding: '6px 14px',
                                        backgroundColor: newDiscussion.categories.includes(cat) ? theme.primary : theme.inputBg,
                                        color: newDiscussion.categories.includes(cat) ? '#FFFFFF' : theme.text,
                                        border: `1px solid ${newDiscussion.categories.includes(cat) ? theme.primary : theme.border}`,
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => {
                                setShowNewDiscussion(false);
                                setNewDiscussion({ title: '', content: '', categories: [] });
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: theme.inputBg,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartDiscussion}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: theme.primary,
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Post Discussion
                        </button>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div style={{
                backgroundColor: theme.cardBg,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${theme.border}`,
                marginBottom: '20px'
            }}>
                <input
                    type="text"
                    placeholder="Search for a topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        border: `1px solid ${theme.border}`,
                        fontSize: '14px',
                        color: theme.text,
                        backgroundColor: theme.inputBg,
                        marginBottom: '15px',
                        boxSizing: 'border-box'
                    }}
                />

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: activeCategory === cat ? theme.primary : theme.inputBg,
                                color: activeCategory === cat ? '#FFFFFF' : theme.text,
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: activeCategory === cat ? '500' : '400'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Discussion List */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 900 ? '350px 1fr' : '1fr',
                gap: '20px'
            }}>
                {/* Left Sidebar - Discussion Previews */}
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '15px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`,
                    maxHeight: '600px',
                    overflowY: 'auto'
                }}>
                    {filteredDiscussions.map(discussion => (
                        <div
                            key={discussion.id}
                            onClick={() => setSelectedDiscussion(discussion)}
                            style={{
                                padding: '15px',
                                borderBottom: `1px solid ${theme.border}`,
                                cursor: 'pointer',
                                backgroundColor: selectedDiscussion?.id === discussion.id ? theme.hoverBg : 'transparent'
                            }}
                        >
                            <h4 style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: theme.text,
                                marginBottom: '5px',
                                marginTop: 0
                            }}>
                                {discussion.title}
                            </h4>
                            <div style={{
                                fontSize: '12px',
                                color: theme.textLight,
                                marginBottom: '8px'
                            }}>
                                by @{discussion.username}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: theme.textLight,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                💬 {discussion.replyCount || 0} Replies
                            </div>
                        </div>
                    ))}

                    {filteredDiscussions.length === 0 && (
                        <div style={{
                            padding: '30px',
                            textAlign: 'center',
                            color: theme.textLight,
                            fontSize: '14px'
                        }}>
                            No discussions found. Start one!
                        </div>
                    )}
                </div>

                {/* Right Side - Selected Discussion Preview */}
                <div style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px'
                }}>
                    {filteredDiscussions.length > 0 ? (
                        <div style={{
                            textAlign: 'center',
                            color: theme.textLight
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                                Select a discussion to view details
                            </p>
                            <p style={{ fontSize: '14px' }}>
                                Click on any discussion from the list to see the full conversation
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            color: theme.textLight
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌟</div>
                            <p style={{ fontSize: '16px' }}>
                                No discussions yet. Be the first to start a conversation!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunitySpace;
