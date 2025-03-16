import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import './LocationPage.css';
import ArrowButton from '../common/ArrowButton';

const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);
  
  // Function to properly capitalize location name
  const formatLocationName = (locationName) => {
    if (!locationName) return '';
    
    // Split by commas and capitalize each part
    return locationName.split(',')
      .map(part => part.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      )
      .join(', ');
  };

  const decodedLocation = decodeURIComponent(location);
  const formattedLocation = formatLocationName(decodedLocation);

  useEffect(() => {
    const fetchLocationArtifacts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artifacts')
          .select('id, title, image_url, description, period_era')
          .eq('location', decodedLocation)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArtifacts(data);
      } catch (error) {
        console.error('Error fetching location artifacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationArtifacts();
  }, [decodedLocation]);

  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={index} className="artifact-card skeleton">
        <div className="skeleton-img"></div>
        <div className="skeleton-text"></div>
      </div>
    ));
  };

  return (
    <div className="location-container">
      <ArrowButton onClick={() => navigate('/')} />
      
      <div className="location-header">
        <h2>{formattedLocation}</h2>
      </div>
      
      <div 
        className="location-content" 
        ref={contentRef}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="artifact-grid">
            {renderSkeletons()}
          </div>
        ) : artifacts.length > 0 ? (
          <div className="artifact-grid">
            {artifacts.map((artifact) => (
              <div 
                key={artifact.id} 
                className="artifact-card"
                onClick={() => navigate(`/artifact/${artifact.id}`)}
              >
                <img src={artifact.image_url} alt={artifact.title} />
                <div className="artifact-card-overlay">
                  <p className="artifact-title">{artifact.title}</p>
                  {artifact.period_era && (
                    <span className="artifact-period">{artifact.period_era}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No artifacts found for this location</h3>
            <button 
              className="reset-button"
              onClick={() => navigate('/explore')}
            >
              Explore All Artifacts
            </button>
          </div>
        )}
      </div>
      
      {showScrollTop && (
        <button className="scroll-top-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default LocationPage; 