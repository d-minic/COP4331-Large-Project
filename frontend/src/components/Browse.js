/*
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css'; 
import './navbar.css';
import logo from './smarttoothlesspixel.PNG'; 

function test(titleString, authorString)
{
    const grid = document.getElementById("grid");

    const cardTempA = document.createElement("a");
    cardTempA.setAttribute('href', 'https://www.example.com');
    cardTempA.setAttribute('class', 'cardLink');

    const cardTemp = document.createElement("div");
    cardTemp.classList.add("card");

    const title = document.createElement("p");
    title.innerText = titleString;
    cardTemp.append(title);

    const author = document.createElement("p");
    author.innerText = authorString;
    cardTemp.append(author);
    
    cardTempA.append(cardTemp); 

    grid.appendChild(cardTempA);
}
function Browse() {
    return (
    <div id="browseDiv">
        <nav class="navbar">
            <ul class = "navbarul">
                <img class = "navbarimg" src={logo} height="80"></img>
                <li class = "navbarli"><a class = "navbara" href="/">Logout</a></li>
                <li class = "navbarli"><a class = "navbara" href="EditProfile">Profile</a></li>
                <li class = "navbarli"><a class = "navbara" href="Friends">Friends</a></li>
                <li class = "navbarli"><a class = "navbara" href="Leaderboard">Leaderboard</a></li>
                <li class = "navbarli"><a class = "navbara" href="Browse">Browse</a></li>
                <li class = "navbarli"><a class = "navbara" href="">Create</a></li>
                <li class = "navbarli"><a class = "navbara" href="home">Home</a></li>
                
            </ul>
        </nav>

        <button onclick = "test('Chemistry 1', 'Joe')">New Card</button>
        
        <div class = "grid" id="grid">
            <a href="" class = "cardLink">
                <div class="card">
                    <p class = "name">Biology 1</p>
                    <p class = "name">Steve</p>
                </div>
            </a>
        </div>
    
    </div>
    );
}

export default Browse;
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';
import './navbar.css';
import logo from './smarttoothlesspixel.PNG';

function Browse() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();
    const app_name = 'smart-tooth-577ede9ea626';

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const storedUserData = localStorage.getItem('user_data');
            if (storedUserData) {
                const { id } = JSON.parse(storedUserData);

                const response = await fetch(`https://${app_name}.herokuapp.com/api/searchtests`, {
                    method: 'POST',
                    body: JSON.stringify({ search: searchTerm, id: id }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTests(data.results || []);
                } else {
                    console.error('Failed to fetch tests');
                }
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    // Function to navigate to the exam
    const navigateToExam = async (testId) => {
        try {
            const storedUserData = localStorage.getItem('user_data');
            if (storedUserData) {
                const { id } = JSON.parse(storedUserData);

                const addUserTestResponse = await fetch(`https://${app_name}.herokuapp.com/api/useraddtest`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: id,
                        testId: testId,
                        owner: false
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });

                const addUserTestData = await addUserTestResponse.json();
                console.log('User added test:', addUserTestData);
            }
        } catch (error) {
            console.error('Error adding test to user:', error);
        }

        localStorage.setItem('testId', JSON.stringify({ testId }));
        navigate('/exam');
    };

    return (
        <div id="browseDiv">
            <nav className="navbar">
            <ul className="navbarul">
                    <img className="navbarimg" src={logo} alt="logo" height="80"></img>
                    <li className="navbarli"><a className="navbara" href="/">Logout</a></li>
                    <li className="navbarli"><a className="navbara" href="EditProfile">Profile</a></li>
                    <li className="navbarli"><a className="navbara" href="Friends">Friends</a></li>
                    <li className="navbarli"><a className="navbara" href="Leaderboard">Leaderboard</a></li>
                    <li className="navbarli"><a className="navbara" href="Browse">Browse</a></li>
                    <li className="navbarli"><a className="navbara" href="Create">Create</a></li>
                    <li className="navbarli"><a className="navbara" href="Home">Home</a></li>
                </ul>
            </nav>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchTests}>Search</button>
            </div>

            <div className="grid" id="grid">
                {tests.map((test) => (
                    <div key={test._id} className="card" onClick={() => navigateToExam(test._id)}>
                        <p className="name">{test.Name}</p>
                        <p className="author">{test.Creator}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Browse;

