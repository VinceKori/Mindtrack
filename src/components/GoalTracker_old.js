import React, { useState, useEffect, useCallback } from 'react'; // <<< ADD useCallback
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc 
} from 'firebase/firestore';

const GoalTracker = () => {
    const { currentUser } = useAuth();
    const [activeGoals, setActiveGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch active goals from Firestore
    const fetchActiveGoals = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'SelfCareGoal'),
                where("user_id", "==", currentUser.uid),
                where("status", "==", "Active")
            );
            
            const snapshot = await getDocs(q);
            const goalsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setActiveGoals(goalsList);
        } catch (error) {
            console.error("Error fetching goals:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]); 


    // Fetch goals when the component first loads or when the user changes
    useEffect(() => {
        fetchActiveGoals(); 
    }, [fetchActiveGoals]); 


    // Function to mark a goal as completed
    const handleCompleteGoal = async (goalId) => {
        if (!window.confirm("Mark this goal as completed?")) return;

        try {
            const goalRef = doc(db, 'SelfCareGoal', goalId);
            
            await updateDoc(goalRef, {
                status: 'Completed',
                completed_at: new Date()
            });
            
            fetchActiveGoals(); 
            alert("Goal successfully marked as Completed! Great job!");

        } catch (error) {
            console.error("Error completing goal:", error);
            alert("Failed to update goal status.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#6C757D' }}>Loading...</div>;
    }
    
    return (
        <div style={{ padding: '0' }}>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '15px',
                marginTop: 0
            }}>
                Self-Care Goals
            </h3>
            
            {activeGoals.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6C757D', fontSize: '14px' }}>
                    No active goals yet. Create one!
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {activeGoals.map(goal => {
                        // Calculate progress percentage
                        const target = parseFloat(goal.target_value) || 100;
                        const current = parseFloat(goal.current_value) || 0;
                        const progress = Math.min((current / target) * 100, 100);
                        const isCompleted = progress >= 100;

                        return (
                            <div key={goal.id} style={{ marginBottom: '15px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        color: '#2C3E50'
                                    }}>
                                        {goal.goal_type || 'Goal'}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        color: isCompleted ? '#10B981' : '#6C757D'
                                    }}>
                                        {isCompleted ? 'Completed' : `${current}${goal.unit || ''} / ${target}${goal.unit || ''}`}
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    backgroundColor: '#E1E8ED',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: '100%',
                                        backgroundColor: isCompleted ? '#10B981' : '#4A90E2',
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
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#fafffa'
                            }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: colors.text }}>{goal.goal_type} ({goal.frequency})</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                    Target: {goal.target_date.toDate().toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCompleteGoal(goal.id)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: colors.success,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}
                            >
                                Complete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GoalTracker;