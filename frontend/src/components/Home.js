import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import logo from './smarttoothlesspixel.PNG'; 

function Home() {
    return (
    <div id="homeDiv">
        <nav class="navbar">
            <ul>
                <img src={logo} height="80"></img>
                <li><Link to="/LandingPage">Logout<link></li>
                <li><a href="">Profile</a></li>
                <li><a href="">Friends</a></li>
                <li><a href="">Leaderboard</a></li>
                <li><a href="">Browse</a></li>
                <li><a href="">Create</a></li>
                <li><Link to="/home">Home<link></li>
                
            </ul>
        </nav>
    
        <main>
            <h1>Recent:</h1>
            <div class="wrapper">
                <div class="item">Biology 1</div>
                <div class="item">Biology 2</div>
                <div class="item">Chemistry 1</div>
                <div class="item">Chemistry 2</div>
                <div class="item">Physics 1</div>
                <div class="item">Physics 2</div>
            </div>
            <h1>Popular:</h1>
            <div class="wrapper">
                <div class="item">Biology 1</div>
                <div class="item">Biology 2</div>
                <div class="item">Chemistry 1</div>
                <div class="item">Chemistry 2</div>
                <div class="item">Physics 1</div>
                <div class="item">Physics 2</div>
            </div>
        </main>
    </div>
    );
}

export default Home;
