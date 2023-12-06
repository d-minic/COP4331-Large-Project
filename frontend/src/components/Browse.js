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

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Browse.css';
import './navbar.css';
import logo from './smarttoothlesspixel.PNG';
import { useNavigate } from 'react-router-dom';

function Browse() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    // Function to handle search
    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/searchtests', {
                method: 'POST',
                body: JSON.stringify({ search: searchTerm }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                setTests(data.results || []);
            } else {
                console.error('Failed to fetch tests');
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    // Function to navigate to the exam
    const navigateToExam = (testId) => {
        localStorage.setItem('testId', JSON.stringify({ testId }));
        navigate('/exam');
    };

    return (
        <div id="browseDiv">
            <nav className="navbar">
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

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
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
