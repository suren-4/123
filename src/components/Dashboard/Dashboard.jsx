import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../UploadModal/UploadModal';
import './Dashboard.css';

// Move orgDetailsMap outside component to avoid recreation on each render
const orgDetailsMap = {
  admin: {
    name: "National Heritage Administration",
    type: "Government Organization",
    location: "New Delhi, India",
    contact: "+91 1234567890",
    email: "admin@heritage.org",
    stats: {
      uploaded: 150,
      inProgress: 45,
      shared: 89,
      contributors: 12
    }
  },
  curator: {
    name: "Heritage Museum",
    type: "Cultural Institution",
    location: "Mumbai, India",
    contact: "+91 9876543210",
    email: "curator@museum.org",
    stats: {
      uploaded: 120,
      inProgress: 30,
      shared: 65,
      contributors: 8
    }
  },
  user1: {
    name: "Local Heritage Society",
    type: "Non-Profit Organization",
    location: "Bangalore, India",
    contact: "+91 8765432109",
    email: "society@heritage.org",
    stats: {
      uploaded: 80,
      inProgress: 20,
      shared: 45,
      contributors: 5
    }
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [orgDetails, setOrgDetails] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Handle click outside sidebar
  const handleClickOutside = useCallback((e) => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    if (sidebar && !sidebar.contains(e.target) && 
        menuToggle && !menuToggle.contains(e.target) && 
        sidebarActive) {
      setSidebarActive(false);
    }
  }, [sidebarActive]);

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    setOrgDetails(orgDetailsMap[user] || orgDetailsMap.user1);
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className="dashboard-container">
      <aside id="sidebar" className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="org-profile">
          <div className="org-logo">
            <i className="fas fa-landmark"></i>
          </div>
          <h2>{orgDetails.name}</h2>
          <p>{orgDetails.type}</p>
        </div>

        <div className="org-details">
          <h3>Organization Details</h3>
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{orgDetails.location}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-phone"></i>
            <span>{orgDetails.contact}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-envelope"></i>
            <span>{orgDetails.email}</span>
          </div>
        </div>
      </aside>

      <div className="top-header">
        <div className="left-section">
          <button id="menuToggle" className="menu-toggle" onClick={handleMenuClick}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>Dashboard</h1>
        </div>
        <div className="right-section">
          <span>Welcome, {currentUser}</span>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className={`main-content ${sidebarActive ? 'sidebar-active' : ''}`}>
        <div className="welcome-card">
          <h2>Welcome to Cultural Heritage Portal</h2>
          <p>
            Manage and preserve our cultural heritage through digital documentation. Our platform provides comprehensive tools 
            for archiving, cataloging, and sharing cultural artifacts and historical documents.
          </p>
          <div className="features">
            <div className="feature-item">
              <i className="fas fa-archive"></i>
              <h3>Digital Archiving</h3>
              <p>Securely store and organize cultural artifacts with our advanced digital archiving system.</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-search"></i>
              <h3>Easy Search</h3>
              <p>Quickly find and access archived items with our powerful search functionality.</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-share-alt"></i>
              <h3>Collaboration</h3>
              <p>Share and collaborate with other institutions to preserve our cultural heritage.</p>
            </div>
          </div>
        </div>

      </div>

      <button className="upload-btn" onClick={handleUpload}>
        <i className="fas fa-cloud-upload-alt"></i>
        Upload New Item
      </button>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard; 