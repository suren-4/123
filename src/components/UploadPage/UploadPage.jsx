import React, { useState, useEffect } from 'react';
import './UploadPage.css';
import { supabase } from '../../config/supabase';
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { generateCsvTemplate } from './csvTemplate';

const UploadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // For a single image, store it as a string
  const imageUrl = location.state?.imageUrl || '';
  
  console.log("Image URL received:", imageUrl);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    resource_type: '',
    material: '',
    period_era: '',
    language: '',
    current_location: '',
    excavator: '',
    reference_doc: '',
    // Store a single image URL
    image_url: imageUrl
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const resource_types = [
    "Artifacts",
    "Ecofacts",
    "Features",
    "Structures",
    "Sites",
    "Bioarchaeological Resources",
    "Geoarchaeological Resources",
    "Ethnoarchaeological Resources",
    "Experimental Archaeology Resources",
    "Underwater Archaeological Resources",
    "Industrial and Technological Remains",
    "Astronomical and Calendar-Related Resources",
    "Unknown"
  ];

  const material_types = [
    // Stone & Rock
    "Granite", "Sandstone", "Limestone", "Marble",  

    // Metal Artifacts
    "Copper", "Bronze", "Iron", "Gold",  

    // Pottery & Ceramics
    "Terracotta", "Painted Grey Ware", "Black-and-Red Ware",  

    // Organic Materials
    "Wood", "Palm Leaf Manuscripts", "Cotton",  

    // Bone, Ivory & Shell
    "Ivory Carvings", "Shell Ornaments",  

    // Construction Materials
    "Mud Bricks", "Lime Plaster",  

    // Inscriptions & Manuscripts
    "Rock Inscriptions", "Copper Plates", "Unknown"
  ];

  // Handle form field changes
  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log('Starting form submission...');
    console.log('Form data:', formData);

    // Validate form data
    for (const key in formData) {
      // Skip validation for image_url if you allow it to be empty
      if (key === 'image_url') continue;

      if (typeof formData[key] === 'string' && formData[key].trim() === '') {
        const errorMsg = `Field ${key} is required`;
        console.log(errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }
    }

    try {
      // Insert data into Supabase
      console.log('Attempting to insert data...');
      const { data, error } = await supabase
        .from('artifacts')
        .insert([formData])
        .select();

      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }

      console.log('Data inserted successfully:', data);

      // Clear form and show success
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        resource_type: '',
        material: '',
        period_era: '',
        language: '',
        current_location: '',
        excavator: '',
        reference_doc: '',
        image_url: '' // Reset to empty string
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage = err.message || 'An unknown error occurred';
      console.error('Error details:', err);
      setError(`Error storing artifact: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV Upload
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const data = results.data[0]; // First row as data

          // Map CSV data to form fields
          setFormData({
            title: data[0] || '',
            description: data[1] || '',
            date: data[2] || '',
            location: data[3] || '',
            resource_type: data[4] || '',
            material: data[5] || '',
            period_era: data[6] || '',
            language: data[7] || '',
            current_location: data[8] || '',
            excavator: data[9] || '',
            reference_doc: data[10] || '',
            // Keep existing single image URL
            image_url: imageUrl 
          });
          
          setCsvData(data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setError('Error parsing CSV file');
        }
      });
    }
  };

  const downloadTemplate = () => {
    generateCsvTemplate();
  };

  return (
    <div className="upload-page">
      <div className="page-container">
        {/* Single image display */}
        <div className="image-container">
          {imageUrl ? (
            <div className="image-grid">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="preview-image" 
              />
            </div>
          ) : (
            <div className="preview-placeholder">
              <i className="fas fa-image"></i>
              <p>No preview available</p>
            </div>
          )}
        </div>
        
        <div className="upload-container">
          <div className="header">
            <h1>Upload New Item</h1>
            
            <div className="csv-upload-section">
              <label htmlFor="csvUpload" className="csv-upload-label">
                <i className="fas fa-file-csv"></i>
                Upload Draft CSV
              </label>
              <input
                type="file"
                id="csvUpload"
                accept=".csv"
                onChange={handleCsvUpload}
                style={{ display: 'none' }}
              />
              {csvData && (
                <div className="csv-success">
                  <i className="fas fa-check"></i>
                  Draft data loaded
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div 
              className="error-message" 
              style={{ color: 'red', marginBottom: '1rem', padding: '10px', backgroundColor: '#fee' }}
            >
              Error: {error}
            </div>
          )}
          
          {success && (
            <div 
              className="success-message" 
              style={{ color: 'green', marginBottom: '1rem', padding: '10px', backgroundColor: '#efe' }}
            >
              Item uploaded successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-groups-container">
              <div className="form-group">
                <label htmlFor="titleInput">Title:</label>
                <input 
                  type="text" 
                  id="titleInput"
                  name="title" 
                  value={formData.title} 
                  onChange={handleResourceChange} 
                  placeholder="Enter title..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="descriptionInput">Description:</label>
                <input 
                  type="text" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateInput">Date:</label>
                <input 
                  type="date" 
                  id="dateInput"
                  name="date" 
                  value={formData.date} 
                  onChange={handleResourceChange}
                  min="1000-01-01"
                  max="2024-12-31"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              <div className="form-group">
                <label htmlFor="locationInput">Location:</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="ResourceType">Resource Type:</label>
                <select 
                  id="ResourceType" 
                  name="resource_type"
                  value={formData.resource_type} 
                  onChange={handleResourceChange}
                >
                  <option value="">-- Select --</option>
                  {resource_types.map((resource_type, index) => (
                    <option key={index} value={resource_type}>
                      {resource_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="materialInput">Material:</label>
                <select 
                  id="materialType" 
                  name="material" 
                  value={formData.material} 
                  onChange={handleResourceChange}
                >
                  <option value="">-- Select --</option>
                  {material_types.map((material_type, index) => (
                    <option key={index} value={material_type}>
                      {material_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="periodEra">Period/Era:</label>
                <input 
                  type="text" 
                  name="period_era"
                  value={formData.period_era} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="languageInput">Language/Script:</label>
                <input 
                  type="text" 
                  name="language" 
                  value={formData.language} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentLocationInput">Current Location:</label>
                <input 
                  type="text" 
                  name="current_location"
                  value={formData.current_location} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="excavatorInput">Excavator Name:</label>
                <input 
                  type="text" 
                  name="excavator" 
                  value={formData.excavator} 
                  onChange={handleResourceChange} 
                  placeholder="Type here..." 
                />
              </div>

              <div className="form-group">
                <label htmlFor="referenceDocInput">Reference Document:</label>
                <input 
                  type="text" 
                  id="referenceDocInput"
                  name="reference_doc"
                  value={formData.reference_doc} 
                  onChange={handleResourceChange} 
                  placeholder="Enter reference document..."
                />
              </div>
            </div>
            
            <div className="submit-btn-container">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Submit Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
