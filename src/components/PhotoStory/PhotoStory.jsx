import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowButton from '../common/ArrowButton';
import './PhotoStory.css';

const PhotoStory = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo stories for different types of artifacts
  const demoStories = {
    temple: "This magnificent temple, dating back to the Chola period (9th-13th century CE), stands as a testament to the architectural brilliance of ancient Tamil craftsmen. The intricate stone carvings depict scenes from the Ramayana and various aspects of daily life during that era. The temple's vimana (tower) showcases the typical Dravidian style, with its pyramidal structure rising in diminishing tiers.",
    statue: "This bronze statue, crafted during the Pallava dynasty (6th-9th century CE), exemplifies the sophisticated lost-wax casting technique mastered by ancient Indian artisans. The figure's graceful posture and detailed ornamentation reflect the high artistic standards of the period. The statue likely served both religious and cultural purposes in its original setting.",
    inscription: "This stone inscription, written in Tamil-Brahmi script, dates to approximately the 3rd century BCE. It contains valuable information about ancient trade routes, administrative systems, and social structures. The well-preserved characters provide insights into the evolution of the Tamil language and its writing system.",
    pottery: "This earthenware vessel, discovered in a burial site, represents the sophisticated pottery traditions of the Iron Age (1000-300 BCE) in Tamil Nadu. The distinctive red and black surface treatment and geometric patterns are characteristic of megalithic pottery. The vessel's form suggests it was likely used for storing grains or liquids.",
    jewelry: "This exquisite piece of jewelry, crafted from gold and precious stones, demonstrates the advanced metallurgical skills of ancient Tamil artisans. The intricate filigree work and stone setting techniques point to a period between the 8th and 11th centuries CE. The design motifs combine local traditions with influences from maritime trade connections."
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setGeneratedStory(''); // Reset story when new image is uploaded
    }
  };

  const generateStory = () => {
    setIsLoading(true);
    // Simulate AI processing time
    setTimeout(() => {
      // For demo purposes, randomly select a story
      const storyTypes = Object.keys(demoStories);
      const randomType = storyTypes[Math.floor(Math.random() * storyTypes.length)];
      setGeneratedStory(demoStories[randomType]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="photo-story-container">
      <ArrowButton onClick={() => navigate(-1)} />
      
      <div className="photo-story-content">
        <h1>Sculpture Story Generator</h1>
        <p className="subtitle">Upload a photo of a sculpture or artifact to generate its historical story</p>

        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="upload-button">
            {previewUrl ? 'Change Photo' : 'Upload Photo'}
          </label>
        </div>

        {previewUrl && (
          <div className="preview-section">
            <img src={previewUrl} alt="Uploaded artifact" className="preview-image" />
            <button 
              className="generate-button" 
              onClick={generateStory}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Generating Story...</span>
                </>
              ) : (
                'Generate Story'
              )}
            </button>
          </div>
        )}

        {generatedStory && (
          <div className="story-section">
            <h2>Generated Story</h2>
            <p className="story-text">{generatedStory}</p>
          </div>
        )}

        <div className="info-section">
          <h3>About This Feature</h3>
          <p>
            This is a demo version of our photo story generator. In the future, 
            this feature will use advanced machine learning models to analyze 
            artifact images and generate historically accurate stories based on 
            our extensive archaeological database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStory; 