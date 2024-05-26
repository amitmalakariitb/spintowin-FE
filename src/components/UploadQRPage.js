import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

const UploadQRPage = () => {
    const [qrData, setQrData] = useState(null);
    const navigate = useNavigate();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const imageDataUrl = await readFileAsDataURL(file);
        const qrData = await readQRCode(imageDataUrl);

        if (qrData) {
            setQrData(qrData);
            const { randomCode, hashKey } = extractRandomCodeAndHashKey(qrData);
            navigate(`/spin/${randomCode}/${hashKey}`);
        } else {
            console.error('No QR code found in the image.');
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const readQRCode = async (imageDataUrl) => {
        const image = new Image();
        image.src = imageDataUrl;

        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                resolve(qrCode ? qrCode.data : null);
            };
            image.onerror = (error) => reject(error);
        });
    };

    const extractRandomCodeAndHashKey = (qrData) => {
        const codeHashPair = qrData.replace('http://localhost:3000/', '');

        const [randomCode, hashKey] = codeHashPair.split('|');

        return {
            randomCode: randomCode.trim(),
            hashKey: hashKey.trim()
        };
    };

    return (
        <div>
            <h1>Upload QR Code</h1>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {qrData && <p>Redirecting to Spin Page...</p>}
        </div>
    );
};

export default UploadQRPage;
