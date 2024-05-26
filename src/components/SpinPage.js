import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormPage.css';

function FormPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const hash = params.get('hash');
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/user/send-otp', { mobile_number: mobileNumber });

            console.log(mobileNumber)
            if (response.status === 200) {
                setOtpSent(true);
                alert('OTP sent successfully');
            } else {
                alert('Error sending OTP');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/user/verify-otp', { mobile_number: mobileNumber, otp });
            if (response.status === 200) {
                setVerified(true);
                alert('Mobile number verified successfully');
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error(error);
            alert('Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (otpSent && verified) {
                console.log(name, mobileNumber, locationInput, code, hash)
                const response = await axios.post('http://localhost:5000/api/user/fill-form', { name, mobile_number: mobileNumber, location: locationInput, random_code: code, hash_key: hash });
                if (response.status === 200) {
                    alert('Prize redeemed successfully');
                    localStorage.setItem('token', response.data.token);
                    navigate('/profile');
                } else {
                    alert('Error redeeming prize');
                }
            } else {
                alert('Please send and verify OTP before submitting the form');
            }
        } catch (error) {
            console.error(error);
            alert('Error redeeming prize');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-container">
            <h1 className="form-title">Redeem Prize</h1>
            <form onSubmit={verified ? handleSubmit : handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={verified}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    disabled={verified}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    required
                    className="input-field"
                />
                {otpSent && !verified && (
                    <div className="otp-verification">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="input-field otp-input"
                        />
                        <button className="verify-otp-btn" onClick={handleVerifyOTP}>Verify OTP</button>
                    </div>
                )}
                <div className="terms-condition">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="terms-checkbox"
                    />
                    <label className="terms-label">I accept the terms and conditions</label>
                </div>
                {!otpSent && !verified && (
                    <button className="send-otp-btn" onClick={handleSendOTP}>Send OTP</button>
                )}
                <button type="submit" className="submit-btn" disabled={loading || !verified}>
                    {loading ? 'Loading...' : (verified ? 'Submit' : 'Verify & Submit')}
                </button>
            </form>
        </div>
    );
}

export default FormPage;
