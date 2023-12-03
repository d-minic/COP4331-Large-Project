import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

function Home() {
    return (
    <div id="homeDiv">
            <h1 style="margin-top: 100px; margin-left: 20px">Recent:</h1>
    <div class="wrapper" style="margin-top: 20px;">
        <div class="item">Biology 1</div>
        <div class="item">Biology 2</div>
        <div class="item">Chemistry 1</div>
        <div class="item">Chemistry 2</div>
        <div class="item">Physics 1</div>
        <div class="item">Physics 2</div>
    </div>
    <h1 style="margin-top: 100px; margin-left: 20px">Popular:</h1>
    <div class="wrapper" style="margin-top: 20px;">
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
