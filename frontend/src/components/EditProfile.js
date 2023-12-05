import React, { useState, useEffect } from 'react';
const app_name = 'smart-tooth-577ede9ea626'

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

const EditProfile = () => {
  const [userData, setUserData] = useState({
    id: '65623cb210dcacc0c1486814', // Leave blank after test
    FirstName: '',
    LastName: '',
    Email: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {

      const response = await fetch(buildPath('api/edituser'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(    
        {id: '65623cb210dcacc0c1486814', 
        firstName: userData.FirstName,
        lastName: userData.LastName,
        email: userData.Email,}),
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
        const response = await fetch(buildPath('api/getuserinfo'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: "65623cb210dcacc0c1486814" }),
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
          console.log(data.results);
          setError('');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to fetch user info');
      }
    };

    fetchUserInfo();
  }, []); // fetch when the user ID changes

  return (
    <div>
      <h1>Edit Profile</h1>
      <div>
        <label htmlFor="FirstName">First Name:</label>
        <input
          type="text"
          id="FirstName"
          name="FirstName"
          value={userData.FirstName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="LastName">Last Name:</label>
        <input
          type="text"
          id="LastName"
          name="LastName"
          value={userData.LastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="Email">Email:</label>
        <input
          type="text"
          id="Email"
          name="Email"
          value={userData.Email}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSaveProfile}>Save Profile</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default EditProfile;
