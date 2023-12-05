import React, { useState, useEffect } from 'react';
import './Friends.css'; // Import the CSS file

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return `https://${app_name}.herokuapp.com${route}`;
    } else {
      return `http://localhost:5000${route}`;
    }
  }

  const fetchFriends = async () => {
    try {
      const response = await fetch(buildPath('/api/getfriends'), {
        method: 'POST',
        body: JSON.stringify({ id: userId, search: searchQuery }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      setFriendsData(data.results);
    } catch (error) {
      console.error('Error fetching getfriends:', error);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const response = await fetch(buildPath('/api/addfriend'), {
        method: 'POST',
        body: JSON.stringify({ id1: userId, id2: friendId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.error) {
        console.error('Error adding friend:', result.error);
      } else {
        console.log('Friend added successfully!');
        // You may want to fetch friends again to update the list after adding a friend
        fetchFriends();
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  useEffect(() => {
    // Assuming you have a way to get the user ID
    const loggedInUserId = ''; // Replace this with your logic to get the logged-in user ID
    setUserId(loggedInUserId);

    fetchFriends();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div id="friends">
      <h1>Your Friends</h1>
      <div>
        <label htmlFor="search">Search Friends:</label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <ul>
        {friendsData.map((friend) => (
          <li key={friend._id}>
            <span className="friendName">{friend.Login}</span>
            <span className="friendScore">{friend.Points}</span>
            <button onClick={() => addFriend(friend._id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
