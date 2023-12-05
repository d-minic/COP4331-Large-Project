import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css'; 
import logo from './smarttoothlesspixel.PNG'; 

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
    
    </div>
    );
}

export default Browse;
