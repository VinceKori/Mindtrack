import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    addDoc,
    doc
} from 'firebase/firestore';

const GoalTracker = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingGoal, setEditingGoal] = useState(null);
    const [tempValue, setTempValue] = useState('');

    // Predefined goals with progress tracking
    const defaultGoals = useMemo(() => [
        { id: 'hydrate', name: 'Hydrate', target: 2, current: 0, unit: 'L' },
        { id: 'journaling', name: 'Journaling', target: 1, current: 0, unit: 'session' },
        { id: 'mindful', name: 'Mindful Minutes', target: 10, current: 0, unit: 'min' },
        { id: 'walk', name: 'Walk', target: 30, current: 0, unit: 'min' }
    ], []);

    const fetchGoals = useCallback(async () => {
        if (!currentUser) {
            setGoals(defaultGoals);
            setLoading(false);
            return;
        }

        try {
            const goalsQuery = query(
                collection(db, 'SelfCareGoal'),
                where('user_id', '==', currentUser.uid),
                where('date', '==', new Date().toDateString())
            );
            
            const snapshot = await getDocs(goalsQuery);
            
            if (snapshot.empty) {
                setGoals(defaultGoals);
            } else {
                const fetchedGoals = snapshot.docs.map(doc => ({
                    docId: doc.id,
                    ...doc.data()
                }));
                setGoals(fetchedGoals);
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
            setGoals(defaultGoals);
        } finally {
            setLoading(false);
        }
    }, [currentUser, defaultGoals]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleUpdateGoal = async (goalId, newValue) => {
        if (!currentUser) {
            alert('Please log in to update goals');
            return;
        }

        const updatedGoals = goals.map(g => 
            g.id === goalId ? { ...g, current: parseFloat(newValue) || 0 } : g
        );
        setGoals(updatedGoals);
        setEditingGoal(null);

        try {
            const updatedGoal = updatedGoals.find(g => g.id === goalId);
            
            if (updatedGoal.docId) {
                // Update existing document
                await updateDoc(doc(db, 'SelfCareGoal', updatedGoal.docId), {
                    current: updatedGoal.current,
                    updated_at: new Date()
                });
            } else {
                // Create new document
                await addDoc(collection(db, 'SelfCareGoal'), {
                    user_id: currentUser.uid,
                    id: updatedGoal.id,
                    name: updatedGoal.name,
                    target: updatedGoal.target,
                    current: updatedGoal.current,
                    unit: updatedGoal.unit,
                    date: new Date().toDateString(),
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px', color: theme.textLight }}>Loading...</div>;
    }
    
    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: theme.text,
                marginBottom: '15px',
                marginTop: 0
            }}>
                Self-Care Goals
            </h3>
            
            {goals.length === 0 ? (
                <p style={{ textAlign: 'center', color: theme.textLight, fontSize: '14px' }}>
                    No active goals yet.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {goals.map(goal => {
                        const progress = Math.min((goal.current / goal.target) * 100, 100);
                        const isCompleted = progress >= 100;
                        const isEditing = editingGoal === goal.id;

                        return (
                            <div key={goal.id}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: theme.text
                                    }}>
                                        {goal.name}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={tempValue}
                                                    onChange={(e) => setTempValue(e.target.value)}
                                                    style={{
                                                        width: '60px',
                                                        padding: '4px 8px',
                                                        border: `1px solid ${theme.border}`,
                                                        borderRadius: '4px',
                                                        fontSize: '13px',
                                                        color: theme.text,
                                                        backgroundColor: theme.inputBg
                                                    }}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleUpdateGoal(goal.id, tempValue)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: theme.primary,
                                                        color: '#FFFFFF',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setEditingGoal(null)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: theme.inputBg,
                                                        color: theme.text,
                                                        border: `1px solid ${theme.border}`,
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    onClick={() => {
                                                        setEditingGoal(goal.id);
                                                        setTempValue(goal.current.toString());
                                                    }}
                                                    style={{
                                                        fontSize: '13px',
                                                        color: isCompleted ? '#10B981' : theme.textLight,
                                                        cursor: 'pointer',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: theme.inputBg,
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = theme.inputBg}
                                                >
                                                    {isCompleted ? 'Completed' : `${goal.current}${goal.unit} / ${goal.target}${goal.unit}`}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: theme.border,
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        backgroundColor: isCompleted ? '#10B981' : theme.primary,
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GoalTracker;
