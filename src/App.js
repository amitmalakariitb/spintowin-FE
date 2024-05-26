import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import UploadQRPage from './components/UploadQRPage';
import SpinPage from './components/SpinPage';
import FillFormPage from './components/FormPage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadQRPage />} />
        <Route path="/spin/:randomCode/:hashkey" element={<SpinPage />} />
        <Route path="/fill-form" element={<FillFormPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
