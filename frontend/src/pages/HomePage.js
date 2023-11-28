import React from 'react';
import './HomePage.css'; /

const HomePage = () => {
  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light fs-5">
        <a className="navbar-brand mb-0 h1">
          <img className="d-inline-block align-top" src="smarttoothlogo.PNG" width="200" alt="Logo" />
        </a>
        <button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          className="navbar-toggler"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active"><h4>Home</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Create</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Browse</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Leaderboard</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Friends</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Profile</h4></a>
            </li>
            <li className="nav-item">
              <a className="nav-link"><h4>Logout</h4></a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="content-section">
        <h1 className="content-header">Recent:</h1>
        <div className="wrapper">
          <div className="item">Biology 1</div>
          <div className="item">Biology 2</div>
          <div className="item">Chemistry 1</div>
          <div className="item">Chemistry 2</div>
          <div className="item">Physics 1</div>
          <div className="item">Physics 2</div>
        </div>

        <h1 className="content-header">Popular:</h1>
        <div className="wrapper">
          <div className="item">Biology 1</div>
          <div className="item">Biology 2</div>
          <div className="item">Chemistry 1</div>
          <div className="item">Chemistry 2</div>
          <div className="item">Physics 1</div>
          <div className="item">Physics 2</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
