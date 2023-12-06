import React, { useState, useEffect } from 'react';
import styles from './EditProfile.css'; // Import the CSS file

const EditProfile = () => {
  const [userData, setUserData] = useState({
    id: '', // Leave blank after test
    firstName: '',
    lastName: '',
    email: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/edituser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Profile saved successfully
        setError('');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/getuserinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userData.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          // Autofill with info from getuserinfo 
          setUserData(data.results || {});
          setError('');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to fetch user info');
      }
    };

    fetchUserInfo();
  }, [userData.id]); // fetch when the user ID changes

  return (
    <div>
      <h1>Edit Profile</h1>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSaveProfile}>Save Profile</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default EditProfile;
