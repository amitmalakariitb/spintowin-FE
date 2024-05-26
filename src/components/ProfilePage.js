import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
    const token = localStorage.getItem('token');
    // const [profile, setProfile] = useState({});
    const [winnings, setWinnings] = useState([]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { 'x-access-token': token }
                });
                setName(profileResponse.data.userProfile.name);
                setPhoneNumber(profileResponse.data.userProfile.mobile_number);
                setLocationInput(profileResponse.data.userProfile.location);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const fetchWinnings = async () => {
            try {
                const winningsResponse = await axios.get('http://localhost:5000/api/user/winning-page', {
                    headers: { 'x-access-token': token }
                });
                setWinnings(winningsResponse.data.winnings);
                console.log("fuck", winningsResponse.data)

            } catch (error) {
                console.error('Error fetching winnings:', error);
            }
        };

        fetchProfile();
        fetchWinnings();
    }, [token]);

    const redeemWinnings = async (winningsId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/redeem-winnings', { uniqueCodeId: winningsId }, {
                headers: { 'x-access-token': token }
            });
            if (response.status === 200) {
                setWinnings(prevWinnings => prevWinnings.map(winning => {
                    if (winning.id === winningsId) {
                        return { ...winning, redeemed: true };
                    }
                    return winning;
                }));
            } else {
                console.error('Error redeeming winnings:', response.data.message);
            }
        } catch (error) {
            console.error('Error redeeming winnings:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:5000/api/user/profile', {
                name,
                phoneNumber,
                location: locationInput
            }, {
                headers: { 'x-access-token': token }
            });
            if (response.status === 200) {
                alert('Profile updated successfully');
            } else {
                console.error('Error updating profile:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-heading">Profile Page</h1>
            <div className="profile-section">
                <h2 className="section-heading">User Profile</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                    <label className="form-label">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Phone Number:
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="form-input"
                        />
                    </label>
                    <label className="form-label">
                        Location:
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="form-input"
                        />
                    </label>
                    <button type="submit" className="form-button">
                        Update Profile
                    </button>
                </form>
            </div>
            <div className="winnings-section">
                <h2 className="section-heading">Winnings</h2>
                <div className="winnings-grid">
                    {Array.isArray(winnings) && winnings.map(winning => (
                        <div key={winning.id} className="winnings-card">
                            <div className="prize">{winning.prize}</div>
                            {!winning.redeemed ? (
                                <button onClick={() => redeemWinnings(winning.unique_code_id)} className="redeem-button">
                                    Redeem
                                </button>
                            ) : (
                                <span className="redeemed-message">Redeemed</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
