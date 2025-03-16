import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MuseumPartnership.css';
import ArrowButton from '../common/ArrowButton';

const MuseumPartnership = () => {
  const navigate = useNavigate();
  
  // Mock data for partner museums
  const museums = [
    {
      id: 1,
      name: "National Museum of India",
      location: "New Delhi",
      description: "Home to thousands of rare artifacts spanning over 5,000 years of Indian cultural heritage.",
      image_url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",

      artifact_count: 2500,
      rating: 4.8,
      ticket_price: 250,
      opening_hours: "10:00 AM - 6:00 PM",
      address: "Janpath, New Delhi, 110001"
    },
    {
      id: 2,
      name: "Madras Museum",
      location: "Chennai",
      description: "The second oldest museum in India featuring bronze sculptures, archaeological artifacts, and rare manuscripts.",
      image_url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      artifact_count: 1800,
      rating: 4.5,
      ticket_price: 150,
      opening_hours: "9:30 AM - 5:00 PM",
      address: "Pantheon Road, Egmore, Chennai, 600008"
    },
    {
      id: 3,
      name: "Archaeological Museum",
      location: "Karnataka",
      description: "Showcasing the rich cultural heritage of the Vijayanagara Empire with sculptures, coins, and inscriptions.",
      image_url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      artifact_count: 1200,
      rating: 4.7,
      ticket_price: 100,
      opening_hours: "10:00 AM - 5:30 PM",
      address: "Hampi, Bellary District, Karnataka, 583239"
    }
  ];

  const handleBookTickets = () => {
    alert("This is a demo. In a real application, you would be able to book tickets to see this artifact in person, and Kalanjiyam would earn a commission on each booking.");
  };

  const handlePartnerApplication = () => {
    alert("This is a demo. In a real application, you would be able to apply to become a museum partner.");
  };

  return (
    <div className="museum-partnership-container">
      <ArrowButton onClick={() => navigate(-1)} />
      
      <div className="partnership-header">
        <h1>Experience Artifacts in Person</h1>
        <p>Discover our partner museums where you can see these artifacts up close and personal.</p>
      </div>
      
      <div className="museums-grid">
        {museums.map(museum => (
          <div key={museum.id} className="museum-card">
            <div className="museum-image">
              <img src={museum.image_url} alt={museum.name} />
            </div>
            <div className="museum-info">
              <h2>{museum.name}</h2>
              <p className="museum-location">{museum.location}</p>
              <p className="museum-description">{museum.description}</p>
              <div className="museum-highlights">
                <div className="highlight">
                  <span className="highlight-icon">🏛️</span>
                  <span>{museum.artifact_count} Artifacts</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">⭐</span>
                  <span>{museum.rating} Rating</span>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">💰</span>
                  <span>From ₹{museum.ticket_price}</span>
                </div>
              </div>
              <button 
                className="book-ticket-button"
                onClick={handleBookTickets}
              >
                Book Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
      
      
      <div className="partnership-benefits">
        <h2>Why Book Through Kalanjiyam?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎫</div>
            <h3>Skip the Line</h3>
            <p>Get priority access tickets and avoid long queues at popular museums.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Exclusive Discounts</h3>
            <p>Enjoy special rates available only to Kalanjiyam members.</p>
          </div>
         
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Mobile Tickets</h3>
            <p>Receive instant e-tickets on your phone - no printing required.</p>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default MuseumPartnership; 