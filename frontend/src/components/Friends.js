import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Friends.css'; // Import the CSS file
const userId = "656d0128aaa2ae92a2d981b7";

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
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
      const response = await fetch(buildPath('/api/searchfriends'), {
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

  const removeFriend = async (friendId) => {
    try {
      // Ask for confirmation
      const confirmRemove = window.confirm('Are you sure you want to remove this friend?');

      if (!confirmRemove) {
        return; // User clicked "Cancel"
      }

      const response = await fetch(buildPath('/api/removefriend'), {
        method: 'POST',
        body: JSON.stringify({ id1: userId, id2: friendId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.error) {
        console.error('Error removing friend:', result.error);
      } else {
        console.log('Friend removed successfully!');
        // You may want to fetch friends again to update the list after removing a friend
        fetchFriends();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  useEffect(() => {
    // Assuming you have a way to get the user ID
    const loggedInUserId = ''; // Replace this with your logic to get the logged-in user ID

    fetchFriends();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div id="friends">
      <div className="header">
        <h1>Your Friends</h1>
        <Link to="/AddFriend" className="addFriendButton">
          Add Friend
        </Link>
      </div>
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
            <button className="friendButton" onClick={() => removeFriend(friend._id)}>
              Remove Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
