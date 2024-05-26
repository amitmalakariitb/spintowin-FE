import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Wheel } from 'react-custom-roulette';
import './SpinPage.css';

function SpinPage() {
    const params = useParams();
    const code = params.randomCode;
    const hash = params.hashkey;


    const [prizes, setPrizes] = useState([]);
    const [spinResult, setSpinResult] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [startSpin, setStartSpin] = useState(false);
    const [prizeIndex, setPrizeIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const prizesResponse = await axios.get('http://localhost:5000/api/user/codes');
                const prizesData = prizesResponse.data.map(item => item.prize);
                setPrizes(prizesData);
                console.log("Prizes Data:", prizesData);


                const spinResponse = await axios.post('http://localhost:5000/api/user/spin-to-win', { random_code: code, hash_key: hash });
                console.log("Spin Response Data:", spinResponse.data);
                const prize = spinResponse.data.prize;


                const prizeIndex = prizesData.indexOf(prize);
                if (prizeIndex !== -1) {
                    setPrizeIndex(prizeIndex);
                } else {
                    console.error('Prize not found in the prize list.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [code, hash]);

    const handleSpin = () => {
        if (prizeIndex === null || prizeIndex === -1) {
            console.error('Cannot spin, prize index is invalid.');
            return;
        }

        setSpinning(true);
        setStartSpin(true);


        setTimeout(() => {
            setStartSpin(false);
            setSpinResult(prizes[prizeIndex]);
            setSpinning(false);
        }, 5000);
    };

    return (
        <div className="spin-page-container">
            <h1 className="spin-page-title">Spin to Win</h1>
            <div className="wheel-container">
                {prizes.length > 0 && prizeIndex !== null ? (
                    <Wheel
                        mustStartSpinning={startSpin}
                        prizeNumber={prizeIndex}
                        data={prizes.map(prize => ({ option: prize }))}
                        backgroundColors={['#3e3e3e', '#df3428']}
                        textColors={['#ffffff']}
                        onStopSpinning={() => setStartSpin(false)}
                    />
                ) : (
                    <p>Loading prizes...</p>
                )}
                <button className="spin-button" onClick={handleSpin} disabled={spinning || prizeIndex === null}>
                    {spinning ? 'Spinning...' : 'Spin'}
                </button>
            </div>
            {spinResult && (
                <div className="result-container">
                    <p>Congratulations! You won {spinResult}</p>
                    <Link to={`/fill-form?code=${code}&hash=${hash}`}><button className="redeem-button">Click here to redeem</button></Link>
                </div>
            )}
        </div>
    );
}

export default SpinPage;