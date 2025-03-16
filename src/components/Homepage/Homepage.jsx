import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import './Homepage.css'

const Homepage = () => {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('location, title')
        .not('location', 'is', null)
        .not('location', 'eq', '')
        .order('location')

      if (error) throw error;

      // Create a map to store location data
      const locationMap = new Map();

      // Process each artifact and count items per location
      data.forEach(item => {
        if (item.location && item.location.length > 3) {
          if (!locationMap.has(item.location)) {
            locationMap.set(item.location, {
              name: item.location,
              count: 1
            });
          } else {
            locationMap.get(item.location).count++;
          }
        }
      });

      // Convert map to array and sort by location name
      const uniqueLocations = Array.from(locationMap.values())
        .sort((a, b) => a.name.localeCompare(b.name));

      setLocations(uniqueLocations);

    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Function for future use - navigate to location details
  const handleLocationClick = (location) => {
    navigate(`/location/${encodeURIComponent(location)}`);
  };

  return (
    <div className="homepage">
      <nav className="navigation">
        <ul>
          <li><Link to="/">home</Link></li>
          <li className="dropdown-trigger">
            <span>locations</span>
            <div className="dropdown-content">
              <div className="locations-list">
                {locations.map((loc, index) => (
                  <div 
                    key={index} 
                    className="location-item"
                    onClick={() => handleLocationClick(loc.name)}
                  >
                    <span className="location-name">{loc.name}</span>
                    <span className="location-count">{loc.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </li>
          <li><Link to="/login">login</Link></li>
          <li><Link to="/membership">member</Link></li>
          <li><Link to="/about">about</Link></li>
          <li><Link to="/museums">visit</Link></li>
          <li><Link to="/archaeological-sites">Archaeological Sites</Link></li>
          <li><Link to="/photo-story">Photo Story</Link></li>
        </ul>
      </nav>
      
      <div className="content">
        <h1>Welcome to Kalanjiyam</h1>
        <p>
          A digital gateway to India's rich archaeological heritage. Our platform is designed to preserve, 
          catalog, and showcase historical artifacts with precision and accessibility. Explore a vast collection 
          of ancient materials, from stone inscriptions and pottery to intricate metalwork and manuscripts, all 
          carefully documented with metadata. Whether you're a history enthusiast, researcher, or part of an 
          archaeological organization, our platform enables seamless discovery and contribution. Verified members 
          can securely upload findings, ensuring cultural treasures are preserved for generations to come. 
        </p>
        <button onClick={() => navigate("/explore")}>explore</button>
      </div>
    </div>
  )
}

export default Homepage