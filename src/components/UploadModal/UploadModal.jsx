import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadWithoutProcessing = () => {
    if (fileInputRef1.current) {
      fileInputRef1.current.click(); // Open file picker for direct upload
    }
  };

  const handleUploadWithProcessing = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click(); // Open file picker for processed upload
    }
  };

  // Handler for uploading with processing:
  const handleFileuploadwithProcessing = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Backend enhancing module not connected. Please start the backend server.");
      alert("Backend processing service is not available. Please try direct upload instead.");
      setIsUploading(false);
      return;

      // Step 1: Send file to Flask backend for processing
      const response = await fetch("/enhance_image", {
        method: "POST",
        body: formData,
      });
      const processingTime = Date.now() - startProcessing;
      console.log(`Backend processing completed in ${processingTime}ms`);

      if (!response.ok) {
        const errorResult = await response.json();
        alert(`Error from processing API: ${errorResult.error}`);
        return;
      }

      // Step 2: Receive the processed image as a blob from Flask
      const processedBlob = await response.blob();
      console.log("Processed image received from backend.");

      // Step 3: Create new FormData for Cloudinary upload
      const cloudFormData = new FormData();
      cloudFormData.append("file", processedBlob, "processed.jpg");
      cloudFormData.append("upload_preset", "kalanjiyam");

      // Step 4: Upload the processed image to Cloudinary
      console.log("Uploading processed image to Cloudinary...");
      const startCloudinary = Date.now();
      const cloudResponse = await fetch("https://api.cloudinary.com/v1_1/dyggpacf1/image/upload", {
        method: "POST",
        body: cloudFormData,
      });
      const cloudinaryTime = Date.now() - startCloudinary;
      console.log(`Cloudinary upload completed in ${cloudinaryTime}ms`);


      const uploadedImageUrl = await cloudResponse.json();
      if (cloudResponse.ok) {
        console.log("Processed image uploaded to Cloudinary:", uploadedImageUrl.secure_url);
        alert("Success: Image processed and uploaded!");

        // Step 5: Navigate to the upload page with the Cloudinary URL
        navigate('/uploadpage', { state: { imageUrl: uploadedImageUrl.url } });
      } else {
        alert(`Error uploading to Cloudinary: ${uploadedImageUrl.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for direct upload without processing
  const handleFileuploadwithoutProcessing = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "kalanjiyam");
    data.append("cloud_name", "dyggpacf1");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dyggpacf1/image/upload", {
        method: "POST",
        body: data
      });
      const uploadedImageUrl = await res.json();
      console.log("Direct upload Cloudinary URL:", uploadedImageUrl.url);
      navigate('/uploadpage', { state: { imageUrl: uploadedImageUrl.url } });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Choose Upload Type</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="upload-options">
          <input 
            type="file"
            ref={fileInputRef1}
            style={{ display: 'none' }}
            onChange={handleFileuploadwithoutProcessing}
            accept="image/*"
          />
          
          <button 
            className="upload-option-btn"
            onClick={handleUploadWithoutProcessing}
            disabled={isUploading}
          >
            <i className="fas fa-file-upload"></i>
            <span>{isUploading ? 'Uploading...' : 'Upload Without Processing'}</span>
            <p>Direct upload without image enhancement</p>
          </button>

          <input 
            type="file"
            ref={fileInputRef2}
            style={{ display: 'none' }}
            onChange={handleFileuploadwithProcessing}
            accept="image/*"
          />

          <button 
            className="upload-option-btn"
            onClick={handleUploadWithProcessing}
            disabled={isUploading}
          >
            <i className="fas fa-magic"></i>
            <span>{isUploading ? 'Uploading...' : 'Upload With Processing'}</span>
            <p>Enhanced upload with image processing</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;