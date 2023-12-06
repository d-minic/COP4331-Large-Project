import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './Friends.css'; // Import the CSS file
import logo from './smarttoothlesspixel.PNG'; 
import './navbar.css';

const userId = "656d0128aaa2ae92a2d981b7";

const AddFriends = () => {
  const navigate = useNavigate();  // Initialize useNavigate
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

  const fetchAddFriends = async () => {
    try {
      const response = await fetch(buildPath('/api/searchusers'), {
        method: 'POST',
        body: JSON.stringify({ id: userId, search: searchQuery }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      setFriendsData(data.results);
    } catch (error) {
      console.error('Error fetching searchusers:', error);
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
        fetchAddFriends();
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  useEffect(() => {
    // Assuming you have a way to get the user ID
    const loggedInUserId = ''; // Replace this with your logic to get the logged-in user ID

    fetchAddFriends();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div id="friends">
    <nav className="navbar">
    <ul className="navbarul">
            <img className="navbarimg" src={logo} alt="logo" height="80"></img>
            <li className="navbarli"><a className="navbara" href="/">Logout</a></li>
            <li className="navbarli"><a className="navbara" href="EditProfile">Profile</a></li>
            <li className="navbarli"><a className="navbara" href="Friends">Friends</a></li>
            <li className="navbarli"><a className="navbara" href="Leaderboard">Leaderboard</a></li>
            <li className="navbarli"><a className="navbara" href="Browse">Browse</a></li>
            <li className="navbarli"><a className="navbara" href="AddTest">Create</a></li>
            <li className="navbarli"><a className="navbara" href="Home">Home</a></li>
        </ul>
    </nav>
      <h1>Add New Friends</h1>
      <div>
     <button className="goBackButton" onClick={() => navigate('/Friends')}>
          Go Back to Friends
        </button>
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
            <button className="friendButton" onClick={() => addFriend(friend._id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFriends;
