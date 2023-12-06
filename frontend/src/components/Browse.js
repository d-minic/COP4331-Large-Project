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
