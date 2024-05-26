import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to the QR Code App</h1>
            <Link to="/upload">
                <button className="home-button">Upload QR</button>
            </Link>
        </div>
    );
}

export default HomePage;
