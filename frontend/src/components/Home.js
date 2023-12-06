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
    
            const response = await fetch(buildPath('api/getusertests'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            console.log(data);
            // Check if there's an error in the response
            if (data.error) {
              console.error('Error fetching tests:', data.error);
              return;
            }
    
            // Assuming 'results' is an array in the response
            const tests = data.results;
            // Create copies of the array before sorting
            const sortedRecentTests = [...tests].sort((a, b) => b.DateCreated - a.DateCreated);
            const sortedPopularTests = [...tests].sort((a, b) => b.NumberAccesses - a.NumberAccesses);
    
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
                {test.Name} ({test.Length})
                </div>
            ))}
            </div>

            <h1>Popular:</h1>
        <div className="wrapper">
          {popularTests.map((test) => (
            <div key={test._id} className="item">
              {test.Name} ({test.Length})
            </div>
          ))}
        </div>
      </main>
    </div>
    );
}

export default Home;