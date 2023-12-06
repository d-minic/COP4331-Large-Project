import React, { useState, useEffect } from 'react';
import { ObjectId } from 'mongodb';

const EditProfile = () => {
  // Retrieve the stored user information from local storage
  const storedUserData = JSON.parse(localStorage.getItem('user_data')) || {};

  const [userData, setUserData] = useState({
    id: storedUserData.id || '', 
    firstName: storedUserData.firstName || '',
    lastName: storedUserData.lastName || '',
    email: storedUserData.email || '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      // Convert 'id' to ObjectId format if it's not empty
      const userId = userData.id ? new ObjectId(userData.id) : '';

      const response = await fetch('/api/edituser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Update local storage with the edited user information
        const updatedUserData = { ...storedUserData, ...userData };
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));

        // Profile saved successfully
        setError('');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    }
  };

  useEffect(() => {
    // Autofill with info from local storage 
    setUserData({
      id: storedUserData.id || '', 
      firstName: storedUserData.firstName || '',
      lastName: storedUserData.lastName || '',
      email: storedUserData.email || '',
    });
  }, [storedUserData.id, storedUserData.firstName, storedUserData.lastName, storedUserData.email]);

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
