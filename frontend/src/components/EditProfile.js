import React, { useState, useEffect } from 'react';
import './EditProfile.css'; // Import the CSS file

const EditProfile = () => {
  // Retrieve the stored user information from local storage
  const storedUserData = JSON.parse(localStorage.getItem('user_data')) || {};


  const [userData, setUserData] = useState({
    id: storedUserData.id || '', 
    firstName: storedUserData.firstName || '',
    lastName: storedUserData.lastName || '',
    email: storedUserData.email || '',
  });
  const app_name = 'smart-tooth-577ede9ea626'


  const convertObjectIdToString = async (objectId) => {
    try {
      const response = await fetch(buildPath('api/convert'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: objectId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to convert ObjectId to string');
      }
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      return data.id;
    } catch (error) {
      console.error('Error converting ObjectId to string:', error);
      throw new Error('Failed to convert ObjectId to string');
    }
  };




  function buildPath(route)
  {
      if (process.env.NODE_ENV === 'production')
      {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      }
      else
      {
        return 'http://localhost:5000/' + route;
      }
  }
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const idString = await convertObjectIdToString(userData.id);
      console.log(idString);
      const response = await fetch(buildPath('api/edituser'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({id:idString, firstName:userData.firstName, lastName:userData.lastName,email:userData.email}),
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
