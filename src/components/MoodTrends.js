import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// 1. Import and register core Chart.js elements
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Numerical mapping for the mood types (used for the Y-axis)
const MOOD_MAPPING = {
  'Happy 😀': 5,
  'Neutral 😐': 4,
  'Stressed 🥵': 3,
  'Anxious 😟': 2,
  'Sad 😥': 1,
};

// Map numerical scores back to labels for the chart axis
const Y_AXIS_LABELS = { 
    5: 'Happy', 
    4: 'Neutral', 
    3: 'Stressed', 
    2: 'Anxious', 
    1: 'Sad' 
};

const MoodTrends = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from Firestore and process it for Chart.js
  useEffect(() => {
    const fetchMoodData = async () => {
      if (!currentUser) {
          setLoading(false);
          return;
      }

      try {
        // Query MoodEntry collection, filter by current user, order by time
        const q = query(
          collection(db, 'MoodEntry'),
          where("user_id", "==", currentUser.uid),
          orderBy("timestamp", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const labels = [];
        const dataPoints = [];

        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          
          // X-axis label: Format date (e.g., "Oct 10")
          const date = entry.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          labels.push(date);
          
          // Y-axis data: Use the numerical mapping
          dataPoints.push(MOOD_MAPPING[entry.mood_type]);
        });
        
        // Update state with processed data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Daily Mood Score',
              data: dataPoints,
              borderColor: '#4c9aff', // Primary color for the line
              backgroundColor: 'rgba(76, 154, 255, 0.4)', // Light fill color
              tension: 0.3, // Curve the line for a softer look
              pointBackgroundColor: '#4c9aff',
              pointBorderColor: '#fff',
              pointHoverRadius: 6,
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [currentUser]);

  // 3. Define Chart options (scales, titles, etc.)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: '#6C757D'
            }
        },
        y: {
            min: 1, 
            max: 5,
            ticks: {
                callback: function(value) {
                    return Y_AXIS_LABELS[value] || '';
                },
                font: { size: 11 },
                color: '#6C757D',
            },
            grid: { color: '#F1F3F5' }
        }
    }
  };

  // 4. Render the component
  if (loading) return <div style={{textAlign: 'center', padding: '20px', color: '#6C757D'}}>Loading...</div>;

  return (
    <div style={{ padding: '0' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: '15px',
        marginTop: 0
      }}>
        Mood Trend
      </h3>
      {chartData.labels.length > 0 ? (
        <div style={{ height: '200px' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <p style={{textAlign: 'center', color: '#6C757D', fontSize: '14px', padding: '20px'}}>
            No mood data yet. Start logging!
        </p>
      )}
    </div>
  );
};

export default MoodTrends;