import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Welcome to the QR Code App</h1>
            <Link to="/upload">
                <button>Upload QR</button>
            </Link>
        </div>
    );
}

export default HomePage;
