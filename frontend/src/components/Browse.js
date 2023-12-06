import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css'; 
import logo from './smarttoothlesspixel.PNG'; 

/*
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
}*/
function Browse() {
    return (
    <div id="browseDiv">
        <nav class="navbar">
            <ul>
                <img src={logo} height="80"></img>
                <li><a href="/">Logout</a></li>
                <li><a href="">Profile</a></li>
                <li><a href="">Friends</a></li>
                <li><a href="Leaderboard">Leaderboard</a></li>
                <li><a href="">Browse</a></li>
                <li><a href="">Create</a></li>
                <li><a href="home">Home</a></li>
                
            </ul>
        </nav>

        <button onclick = "test('Chemistry 1', 'Joe')">New Card</button>
        
        <div class = "grid" id="grid">
            <a href="", class = "cardLink">
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
