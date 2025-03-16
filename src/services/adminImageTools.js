// 1. Metadata Extraction Tool
export const extractMetadata = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      
      image.onload = () => {
        resolve({
          dimensions: `${image.width}x${image.height}`,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          lastModified: new Date(file.lastModified).toLocaleString(),
          aspectRatio: (image.width / image.height).toFixed(2)
        });
      };
    };
    reader.readAsDataURL(file);
  });
};

// 2. Image Quality Checker
export const checkImageQuality = async (file) => {
  const minWidth = 800;
  const minHeight = 600;
  const maxSizeMB = 5;
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/tiff'];
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      
      image.onload = () => {
        const issues = [];
        const recommendations = [];
        
        // Check dimensions
        if (image.width < minWidth || image.height < minHeight) {
          issues.push('Low resolution');
          recommendations.push(`Recommended minimum dimensions: ${minWidth}x${minHeight}px`);
        }
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          issues.push('File size too large');
          recommendations.push(`Recommended maximum size: ${maxSizeMB}MB`);
        }
        
        // Check file type
        if (!acceptedTypes.includes(file.type)) {
          issues.push('Unsupported file format');
          recommendations.push(`Recommended formats: JPEG, PNG, TIFF`);
        }
        
        resolve({
          isAcceptable: issues.length === 0,
          issues,
          recommendations,
          details: {
            currentDimensions: `${image.width}x${image.height}`,
            currentSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
            format: file.type
          }
        });
      };
    };
    reader.readAsDataURL(file);
  });
};

// 3. Auto-Categorization Tool
export const categorizeArtifact = async (image) => {
  try {
    // Analyze image characteristics
    const characteristics = await analyzeImageCharacteristics(image);
    
    return {
      suggestedCategory: determinePrimaryCategory(characteristics),
      suggestedTags: generateTags(characteristics),
      locationSuggestion: 'Tamil Nadu', // Default location
      periodSuggestion: 'Contemporary' // Default period
    };
  } catch (error) {
    console.error('Error in categorization:', error);
    return {
      suggestedCategory: 'Uncategorized',
      suggestedTags: [],
      locationSuggestion: 'Unknown',
      periodSuggestion: 'Unknown'
    };
  }
};

// 4. Duplicate Checker
export const checkForDuplicates = async (file, existingArtifacts) => {
  const imageSignature = await generateImageSignature(file);
  
  return {
    hasDuplicates: false, // Compare with existing artifacts
    similarArtifacts: [], // List of similar artifacts
    similarityScore: 0 // Similarity percentage
  };
};

// 5. Batch Processing Helper
export const processBatchUpload = async (files) => {
  const results = [];
  
  for (const file of files) {
    const metadata = await extractMetadata(file);
    const qualityCheck = await checkImageQuality(file);
    const category = await categorizeArtifact(file);
    
    results.push({
      filename: file.name,
      metadata,
      qualityCheck,
      category,
      status: qualityCheck.isAcceptable ? 'ready' : 'needs-attention'
    });
  }
  
  return {
    totalFiles: files.length,
    readyToUpload: results.filter(r => r.status === 'ready').length,
    needsAttention: results.filter(r => r.status === 'needs-attention').length,
    results
  };
};

// Helper function to analyze image characteristics
const analyzeImageCharacteristics = async (image) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        // Basic image analysis
        const characteristics = {
          size: image.size,
          dimensions: {
            width: img.width,
            height: img.height
          },
          aspectRatio: img.width / img.height,
          format: image.type
        };
        resolve(characteristics);
      };
    };
    reader.readAsDataURL(image);
  });
};

// Helper function to determine category
const determinePrimaryCategory = (characteristics) => {
  // Simple categorization based on image characteristics
  const { dimensions, aspectRatio } = characteristics;
  
  if (aspectRatio > 1.5) return 'Landscape Artifact';
  if (aspectRatio < 0.67) return 'Portrait Artifact';
  if (dimensions.width > 2000) return 'High Resolution Artifact';
  return 'Standard Artifact';
};

// Helper function to generate tags
const generateTags = (characteristics) => {
  const tags = [];
  const { dimensions, format } = characteristics;
  
  // Add dimension-based tags
  if (dimensions.width > 2000) tags.push('high-res');
  if (dimensions.width < 800) tags.push('low-res');
  
  // Add format-based tags
  tags.push(format.split('/')[1]);
  
  return tags;
}; 