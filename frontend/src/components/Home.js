import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
    return (
    <div id="homeDiv">
        
            <nav class="navbar fixed-top navbar-expand-lg navbar-light fs-5">
                <a href="#" class="navbar-brand mb-0 h1">
                    <img class="d-inline-block align-top" src="smarttoothlogo.PNG" width="200" ></img>
                    
                </a>
                <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                class="navbar-toggler"
                aria-controls="navbar"
                aria-expanded="false"
                aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link active">
                                <h4>Home</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Create</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Browse</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Leaderboard</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Friends</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Profile</h4>
                            </a>
                        </li>
                        <li class="navbar-item-active">
                            <a href="#" class="nav-link">
                                <h4>Logout</h4>
                            </a>
                        </li>
                        
                    </ul>
                </div>
            </nav>
        
            <h1 >Recent:</h1>
            <div class="wrapper">
                <div class="item">Biology 1</div>
                <div class="item">Biology 2</div>
                <div class="item">Chemistry 1</div>
                <div class="item">Chemistry 2</div>
                <div class="item">Physics 1</div>
                <div class="item">Physics 2</div>
            </div>
            <h1 >Popular:</h1>
            <div class="wrapper" >
                <div class="item">Biology 1</div>
                <div class="item">Biology 2</div>
                <div class="item">Chemistry 1</div>
                <div class="item">Chemistry 2</div>
                <div class="item">Physics 1</div>
                <div class="item">Physics 2</div>
            </div>
    </div>
    );
}

export default Home;
