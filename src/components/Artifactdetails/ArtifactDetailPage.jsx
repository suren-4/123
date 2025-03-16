import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './ArtifactDetailPage.css';
import ArrowButton from '../common/ArrowButton';

const supabase = createClient('https://hdsnhnhsanfswdlxwhfy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkc25obmhzYW5mc3dkbHh3aGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzMwNTQsImV4cCI6MjA1NjUwOTA1NH0.4Gkp9jmL3mZQBrCfO4VK8ORe-paVDzsg3VNSGvxj00Q');

const ArtifactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const infoSectionRef = useRef(null);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        let { data, error } = await supabase
          .from('artifacts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArtifact(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtifact();
  }, [id]);

  if (loading) {
    return (
      <div className="artifact-detail-container">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-grid">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton-item"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="error-container">
        <h2>Artifact not found</h2>
        <p>The artifact you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/explore')} className="return-button">
          Return to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="artifact-detail-container">
      <ArrowButton onClick={() => navigate('/explore')} />

      <div className="artifact-detail-content">
        <div className="artifact-image-section">
          <img 
            src={artifact.image_url} 
            alt={artifact.title} 
            className="artifact-main-image"
          />
          {artifact.period_era && (
            <div className="artifact-metadata">
              <span className="artifact-period">{artifact.period_era}</span>
            </div>
          )}
        </div>

        <div className="artifact-info-section" ref={infoSectionRef}>
          <h1>{artifact.title}</h1>
          
          <div className="info-grid">
            {/* Description card */}
            {artifact.description && (
              <div className="info-card">
                <h3>Overview</h3>
                <p>{artifact.description}</p>
              </div>
            )}

            {/* Details card with simple rows */}
            <div className="info-card">
              <h3>Details</h3>
              <div className="simple-details">
                {Object.entries(artifact).map(([key, value]) => {
                  // Skip these fields as they're handled separately
                  const skipFields = ['id', 'description', 'image_url', 'title', 'reference_doc', 'created_at'];
                  
                  if (!skipFields.includes(key) && value) {
                    const formattedLabel = key.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    
                    return (
                      <div key={key} className="detail-row">
                        <span className="detail-label">{formattedLabel}:</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Reference document card */}
            {artifact.reference_doc && (
              <div className="info-card reference-section">
                <h3>Additional Resources</h3>
                <a 
                  href={artifact.reference_doc} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="reference-link"
                >
                  View Documentation →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <MuseumPromotion artifactLocation={artifact.location} />
    </div>
  );
};

const MuseumPromotion = ({ artifactLocation }) => {
  const navigate = useNavigate();
  
  // Mock data for related museums
  const relatedMuseums = [
    {
      id: 1,
      name: "National Museum of India",
      location: "New Delhi",
      image_url: "https://images.unsplash.com/photo-1594215221007-e0d3c7e6f335?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 2,
      name: "Madras Museum",
      location: "Chennai",
      image_url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    }
  ].filter(museum => museum.location === artifactLocation || artifactLocation === "New Delhi" || artifactLocation === "Chennai");
  
  if (relatedMuseums.length === 0) return null;
  
  const handleBookTickets = () => {
    alert(`This is a demo. In a real application, you would be able to book tickets to see this artifact in person, and Kalanjiyam would earn a commission on each booking.`);
  };
  
  return (
    <div className="museum-promotion">
      <h3>See This Artifact in Person</h3>
      <div className="related-museums">
        {relatedMuseums.map(museum => (
          <div key={museum.id} className="related-museum-card">
            <img src={museum.image_url} alt={museum.name} />
            <div className="museum-info">
              <h4>{museum.name}</h4>
              <p>{museum.location}</p>
              <button onClick={handleBookTickets}>
                Book Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtifactDetailPage;
