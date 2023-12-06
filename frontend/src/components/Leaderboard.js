import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import the CSS file
import logo from './smarttoothlesspixel.PNG'; 
const userId = "656d0128aaa2ae92a2d981b7";

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
        const response = await fetch(buildPath('/api/getleaders'), {
          method: 'POST',
          body: JSON.stringify({}),
          headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        setLeaderboardData(data.results);
      } catch (error) {
        console.error('Error fetching getleaders:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
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
    <div id="leaderboard">
      <h1>Overall Leaderboard</h1>
      <ul>
        {leaderboardData.map((user) => (
          <li key={user._id}>
            <span className="username">{user.Login}</span>
            <span className="score">{user.Points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
