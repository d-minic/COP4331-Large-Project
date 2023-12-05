

import React, { useState, useEffect } from 'react';
import './Friends.css'; // Import the CSS file

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [userId, setUserId] = useState(''); 

  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return `https://${app_name}.herokuapp.com${route}`;
    } else {
      return `http://localhost:5000${route}`;
    }
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(buildPath('/api/getfriends'), {
          method: 'POST',
          body: JSON.stringify({ id: userId }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        setFriendsData(data.results);
      } catch (error) {
        console.error('Error fetching getfriends:', error);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <div id="friends">
      <h1>Your Friends</h1>
      <ul>
        {friendsData.map((friend) => (
          <li key={friend._id}>
            <span className="friendName">{friend.Login}</span>
            <span className="friendScore">{friend.Points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
