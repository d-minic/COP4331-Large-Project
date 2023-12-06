import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import logo from './smarttoothlesspixel.PNG';
const userId = "65623cb210dcacc0c1486814"
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

function Home() {

    const [recentTests, setRecentTests] = useState([]);
    const [popularTests, setPopularTests] = useState([]);

    useEffect(() => {
        // Fetch data from the 'gettests' endpoint
        const fetchData = async () => {
          try {
            const obj = {
                id: userId,
              };

            const js = JSON.stringify(obj);
    
            const userTestsResponse = await fetch(buildPath('api/getusertests'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });


            const userTestsData = await userTestsResponse.json();
            const userTests = userTestsData.results || [];

            const popularTestsResponse = await fetch(buildPath('api/gettests'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const popularTestsData = await popularTestsResponse.json();
            const allTests = popularTestsData.results || [];

    

            // Assuming 'DateCreated' is a property indicating test creation date
            const sortedRecentTests = [...userTests].sort((a, b) => b.DateCreated - a.DateCreated);
            const sortedPopularTests = [...allTests].sort((a, b) => b.NumberAccesses - a.NumberAccesses);

            setRecentTests(sortedRecentTests);
            setPopularTests(sortedPopularTests);
          } catch (error) {
            console.error('Error fetching tests:', error);
          }
        };
    
        fetchData();
      }, []); // Empty dependency array ensures that this effect runs once after the initial render
    

    return (
    <div id="homeDiv">
        <nav class="navbar">
            <ul>
                <img src={logo} height="80"></img>
                <li><a href="/">Logout</a></li>
                <li><a href="EditProfile">Profile</a></li>
                <li><a href="Friends">Friends</a></li>
                <li><a href="Leaderboard">Leaderboard</a></li>
                <li><a href="Browse">Browse</a></li>
                <li><a href="">Create</a></li>
                <li><a href="home">Home</a></li>
                
            </ul>
        </nav>
    
        <main>
  <h1>Recent:</h1>
  <div className="wrapper">
    {recentTests.map((test) => (
      <div key={test._id} className="item">
        <div className="testInfo">
          <div className="testName">{test.Name}</div>
        </div>
      </div>
    ))}
  </div>

  <h1>Popular:</h1>
  <div className="wrapper">
    {popularTests.map((test) => (
      <div key={test._id} className="item">
        <div className="testInfo">
          <div className="testName">{test.Name}</div>
        </div>
      </div>
    ))}
  </div>
</main>
    </div>
    );
}

export default Home;