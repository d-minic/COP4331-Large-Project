import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import the CSS file

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return `https://${app_name}.herokuapp.com${route}`;
    } else {
      return `http://localhost:5000${route}`;
    }
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(buildPath('/api/leaderboard'));
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div id="leaderboard">
      <h1>Overall Leaderboard</h1>
      <ul>
        {leaderboardData.map((user) => (
          <li key={user.userId}>
            <span className="username">{user.username}</span>
            <span className="score">{user.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
