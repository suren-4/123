import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Homepage from './components/Homepage/Homepage';
import About from './components/About/About';
import './App.css';
import UploadPage from './components/UploadPage/UploadPage';
import Explorepage from './components/ExplorePage/Explorepage';
import ArtifactDetailPage from './components/Artifactdetails/ArtifactDetailPage';
import LocationPage from './components/LocationPage/LocationPage';
import Membership from './components/Membership/Membership';
import MuseumPartnership from './components/MuseumPartnership/MuseumPartnership';
import Chatbot from './components/Chatbot/Chatbot';
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation';
import TamilNaduMap from './components/TamilNaduMap/TamilNaduMap';
import PhotoStory from './components/PhotoStory/PhotoStory';



function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingAnimation onComplete={() => setLoading(false)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/uploadpage" element={<UploadPage />} />
            <Route path="/explore" element={<Explorepage />} />
            <Route path="/artifact/:id" element={<ArtifactDetailPage />} />
            <Route path="/location/:location" element={<LocationPage />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/museums" element={<MuseumPartnership />} />
            <Route path="/archaeological-sites" element={<TamilNaduMap />} />
            <Route path="/photo-story" element={<PhotoStory />} />
          </Routes>
          
          {/* Conditionally render Chatbot based on current path */}
          <Routes>
            <Route path="/" element={<Chatbot />} />
            <Route path="/about" element={<Chatbot />} />
            <Route path="/explore" element={<Chatbot />} />
            <Route path="/artifact/:id" element={<Chatbot />} />
            <Route path="/location/:location" element={<Chatbot />} />
            <Route path="/membership" element={<Chatbot />} />
            <Route path="/museums" element={<Chatbot />} />
            <Route path="/photo-story" element={<Chatbot />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
