import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './TamilNaduMap.css';
import ArrowButton from '../common/ArrowButton';
import { supabase } from '../../config/supabase';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const TamilNaduMap = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('artifacts')
          .select('location')
          .not('location', 'is', null)
          .not('location', 'eq', '');

        if (error) throw error;

        // Count artifacts per location
        const locationCounts = data.reduce((acc, item) => {
          const location = item.location.trim();
          if (!acc[location]) {
            acc[location] = {
              name: location,
              count: 1,
              position: null
            };
          } else {
            acc[location].count++;
          }
          return acc;
        }, {});

        // Get coordinates for each location
        const getCoordinates = async (location) => {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                location + ', Tamil Nadu, India'
              )}`
            );
            const data = await response.json();
            if (data && data[0]) {
              return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
              };
            }
            return null;
          } catch (error) {
            console.error('Geocoding error:', error);
            return null;
          }
        };

        // Add coordinates to locations
        const locationArray = await Promise.all(
          Object.values(locationCounts).map(async (loc, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            const position = await getCoordinates(loc.name);
            return {
              ...loc,
              position: position || { lat: 10.7905, lng: 78.7047 }
            };
          })
        );

        setLocations(locationArray);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner" /><p>Loading map...</p></div>;
  if (error) return <div className="map-error"><p>{error}</p><button onClick={() => window.location.reload()} className="retry-btn">Retry</button></div>;

  return (
    <div className="map-container">
      <div className="map-header-wrapper">
        <ArrowButton onClick={() => window.history.back()} />
        <div className="map-header">
          <div className="header-left">
            <div className="header-content">
              <h1>Archaeological Sites</h1>
              <p className="header-subtitle">Explore the ancient heritage of Tamil Nadu</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{locations.length}</span>
              <span className="stat-label">Sites</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {locations.reduce((total, loc) => total + loc.count, 0)}
              </span>
              <span className="stat-label">Artifacts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="map-content">
        <MapContainer
          center={[10.7905, 78.7047]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker
              key={location.name}
              position={[location.position.lat, location.position.lng]}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{location.name}</strong>
                  <p>{location.count} artifacts found</p>
                  <button 
                    className="view-location-btn"
                    onClick={() => navigate(`/location/${encodeURIComponent(location.name)}`)}
                  >
                    View Location
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TamilNaduMap; 